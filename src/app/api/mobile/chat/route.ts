import { timingSafeEqual } from "node:crypto";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { getModel, type ProviderId } from "@/lib/ai";
import { createWorkspace, listFiles, readFile, writeFile, runCommand } from "@/lib/sandbox";

export const runtime = "nodejs";
export const maxDuration = 300;
const providers = ["openai", "anthropic", "google", "openrouter"] as const;

function hasValidAccess(request: Request) {
  const expected = process.env.APP_ACCESS_PASSWORD;
  const supplied = request.headers.get("x-suprisecode-access") || "";
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  let sandbox: Awaited<ReturnType<typeof createWorkspace>> | undefined;
  try {
    if (!process.env.APP_ACCESS_PASSWORD) {
      return Response.json({ error: "Backend is not configured: set APP_ACCESS_PASSWORD." }, { status: 503 });
    }
    if (!hasValidAccess(request)) return Response.json({ error: "Access password is missing or incorrect." }, { status: 401 });
    const body = await request.json();
    if (typeof body.prompt !== "string" || !body.prompt.trim() || body.prompt.length > 12000) {
      return Response.json({ error: "Enter a prompt between 1 and 12,000 characters." }, { status: 400 });
    }
    const provider = providers.includes(body.provider) ? body.provider as ProviderId : "openai";
    const model = typeof body.model === "string" ? body.model.slice(0, 100) : undefined;
    const repo = typeof body.repositoryUrl === "string" && body.repositoryUrl.trim() ? body.repositoryUrl.trim() : undefined;
    sandbox = await createWorkspace(repo);
    const activeSandbox = sandbox;
    const result = await generateText({
      model: getModel(provider, model),
      system: "You are SupriseCode, an expert coding agent accessed from an Android application. Work only inside the provided remote project workspace. Inspect files before editing. Use list_files, read_file, write_file, and run_command. Explain meaningful changes and report actual command results. Never access secrets, host files, external accounts, or attempt credential extraction. Never run destructive commands, privilege escalation, or publish/push changes. This workspace is temporary and will be discarded after this request. Tell the user clearly that files are not retained and they should export changes before ending the session.",
      prompt: body.prompt,
      stopWhen: stepCountIs(8),
      tools: {
        list_files: tool({ description: "List project files.", inputSchema: z.object({}), execute: async () => ({ files: await listFiles(activeSandbox) }) }),
        read_file: tool({ description: "Read a project text file by relative path.", inputSchema: z.object({ path: z.string().min(1).max(240) }), execute: async ({ path }) => ({ path, content: await readFile(activeSandbox, path) }) }),
        write_file: tool({ description: "Create or replace a project text file.", inputSchema: z.object({ path: z.string().min(1).max(240), content: z.string().max(50000) }), execute: async ({ path, content }) => writeFile(activeSandbox, path, content) }),
        run_command: tool({ description: "Run a permitted project command, such as npm install, npm run build, or git status.", inputSchema: z.object({ command: z.string().min(1).max(300) }), execute: async ({ command }) => runCommand(activeSandbox, command) })
      }
    });
    return Response.json({ text: result.text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agent request failed.";
    console.error("SupriseCode mobile API:", message);
    return Response.json({ error: message }, { status: 500 });
  } finally {
    if (sandbox) await sandbox.stop().catch(() => undefined);
  }
}
