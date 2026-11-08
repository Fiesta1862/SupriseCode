import { timingSafeEqual } from "node:crypto";
import { streamText, stepCountIs, tool, convertToModelMessages } from "ai";
import { z } from "zod";
import { getModel, type ProviderId } from "@/lib/ai";
import { createWorkspace, listFiles, readFile, writeFile, runCommand } from "@/lib/sandbox";

export const runtime = "nodejs";
export const maxDuration = 300;
const providers = ["openai", "anthropic", "google", "openrouter"] as const;

function hasValidAccess(request: Request) {
  const expected = process.env.APP_ACCESS_PASSWORD;
  if (!expected) return false;
  const supplied = request.headers.get("x-suprisecode-access") || "";
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  let sandbox: Awaited<ReturnType<typeof createWorkspace>> | undefined;
  try {
    if (!process.env.APP_ACCESS_PASSWORD) {
      return Response.json({ error: "Set APP_ACCESS_PASSWORD in Vercel environment variables before using this deployment." }, { status: 503 });
    }
    if (!hasValidAccess(request)) return Response.json({ error: "Access password is missing or incorrect." }, { status: 401 });
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 1_000_000) return Response.json({ error: "Request is too large." }, { status: 413 });
    const body = await request.json();
    const provider = providers.includes(body.provider) ? body.provider as ProviderId : "openai";
    const model = typeof body.model === "string" ? body.model.slice(0, 100) : undefined;
    if (!Array.isArray(body.messages) || !body.messages.length) return Response.json({ error: "Message required." }, { status: 400 });
    const repo = typeof body.repositoryUrl === "string" && body.repositoryUrl ? body.repositoryUrl : undefined;
    sandbox = await createWorkspace(repo);
    const activeSandbox = sandbox;
    const result = streamText({
      model: getModel(provider, model),
      messages: await convertToModelMessages(body.messages),
      stopWhen: stepCountIs(8),
      system: "You are SupriseCode, an expert coding agent. Work only inside the provided remote project workspace. Inspect files before editing. Use list_files, read_file, write_file, and run_command. Explain meaningful changes and report actual command results. Never access secrets, host files, external accounts, or attempt credential extraction. Never run destructive commands or privilege escalation. The workspace is temporary and will be discarded after this request; clearly tell the user to export important work.",
      tools: {
        list_files: tool({ description: "List project files.", inputSchema: z.object({}), execute: async () => ({ files: await listFiles(activeSandbox) }) }),
        read_file: tool({ description: "Read a project text file by relative path.", inputSchema: z.object({ path: z.string().min(1).max(240) }), execute: async ({ path }) => ({ path, content: await readFile(activeSandbox, path) }) }),
        write_file: tool({ description: "Create or replace a project text file.", inputSchema: z.object({ path: z.string().min(1).max(240), content: z.string().max(50000) }), execute: async ({ path, content }) => writeFile(activeSandbox, path, content) }),
        run_command: tool({ description: "Run a permitted project command, e.g. npm install, npm run build, git status.", inputSchema: z.object({ command: z.string().min(1).max(300) }), execute: async ({ command }) => runCommand(activeSandbox, command) })
      },
      onFinish: async () => { await activeSandbox.stop().catch(() => undefined); },
      onError: ({ error }) => console.error("SupriseCode agent:", error)
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (sandbox) await sandbox.stop().catch(() => undefined);
    const message = error instanceof Error ? error.message : "Agent request failed.";
    console.error("SupriseCode API:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
