import { Sandbox } from "@vercel/sandbox";
const ROOT = "/vercel/sandbox";
const DENIED = /(^|\\s)(sudo|su|rm|rmdir|mkfs|dd|shutdown|reboot|kill|pkill|chmod|chown|curl|wget|nc|ssh|scp)(\\s|$)|git\\s+push|npm\\s+publish/i;
function cleanPath(input: string) {
  const path = input.replace(/\\\\/g, "/").replace(/^\\/+/, "");
  if (!path || path.split("/").some((part) => part === "..") || path.includes("\\0")) throw new Error("Invalid project path.");
  return path;
}
export async function createWorkspace(repositoryUrl?: string) {
  const sandbox = await Sandbox.create({ runtime: "node24", timeout: 10 * 60 * 1000, networkPolicy: "allow-all" });
  try {
    if (repositoryUrl) {
      const url = new URL(repositoryUrl);
      if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password) throw new Error("Only public HTTPS GitHub repositories are supported.");
      if (!/^\\/[A-Za-z0-9_.-]+\\/[A-Za-z0-9_.-]+\\/?$/.test(url.pathname.replace(/\\.git$/, ""))) throw new Error("Invalid GitHub repository URL.");
      const cloned = await sandbox.runCommand({ cmd: "git", args: ["clone", "--depth", "1", repositoryUrl, ROOT] });
      if (cloned.exitCode !== 0) throw new Error((await cloned.stderr()).slice(0, 1000) || "Repository clone failed.");
    } else await sandbox.runCommand({ cmd: "mkdir", args: ["-p", ROOT] });
    return sandbox;
  } catch (error) { await sandbox.stop().catch(() => undefined); throw error; }
}
export async function listFiles(sandbox: Sandbox) {
  const result = await sandbox.runCommand({ cmd: "find", args: [ROOT, "-maxdepth", "4", "-type", "f", "-not", "-path", "*/node_modules/*", "-not", "-path", "*/.git/*"] });
  return (await result.stdout()).split("\\n").filter(Boolean).slice(0, 250).map((p) => p.replace(ROOT + "/", ""));
}
export async function readFile(sandbox: Sandbox, input: string) {
  const result = await sandbox.runCommand({ cmd: "cat", args: [ROOT + "/" + cleanPath(input)] });
  if (result.exitCode !== 0) throw new Error((await result.stderr()).slice(0, 500) || "Unable to read file.");
  return (await result.stdout()).slice(0, 24000);
}
export async function writeFile(sandbox: Sandbox, input: string, content: string) {
  const path = cleanPath(input);
  const full = ROOT + "/" + path;
  await sandbox.runCommand({ cmd: "mkdir", args: ["-p", full.split("/").slice(0, -1).join("/")] });
  const encoded = Buffer.from(content, "utf8").toString("base64");
  const result = await sandbox.runCommand({ cmd: "bash", args: ["-lc", "printf %s '" + encoded + "' | base64 -d > " + "'" + full.replace(/'/g, "'\\''") + "'"] });
  if (result.exitCode !== 0) throw new Error((await result.stderr()).slice(0, 500) || "Unable to write file.");
  return { path, bytes: Buffer.byteLength(content, "utf8") };
}
export async function runCommand(sandbox: Sandbox, command: string) {
  const text = command.trim();
  if (!text || text.length > 300 || /[;&|<>\\n\\r$]/.test(text) || DENIED.test(text)) throw new Error("Command blocked by workspace safety policy.");
  const parts = text.split(/\\s+/);
  const allowed = new Set(["npm","npx","pnpm","yarn","node","python","python3","pytest","git","ls","pwd","cat","find","grep","head","tail","mkdir","touch","tsc","next","echo"]);
  if (!allowed.has(parts[0])) throw new Error("Command is not on the allowed list.");
  const result = await sandbox.runCommand({ cmd: parts[0], args: parts.slice(1), cwd: ROOT });
  return { exitCode: result.exitCode, stdout: (await result.stdout()).slice(0, 12000), stderr: (await result.stderr()).slice(0, 8000) };
}
