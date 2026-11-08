#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const args = process.argv.slice(2);
const get = (key, fallback = "") => {
  const i = args.indexOf(key);
  return i >= 0 ? args[i + 1] : fallback;
};
const baseUrl = get("--url", process.env.SUPRISecode_URL || process.env.SUPRISCODE_URL);
const password = get("--password", process.env.SUPRISCODE_PASSWORD);
const provider = get("--provider", process.env.SUPRISCODE_PROVIDER || "openai");
const model = get("--model", process.env.SUPRISCODE_MODEL || "");
const repositoryUrl = get("--repo", "");
if (args.includes("--help") || !baseUrl || !password) {
  console.log("SupriseCode CLI — remote coding agent\n\nUsage:\n  suprisecode --url https://your-app.vercel.app --password YOUR_PASSWORD [--provider openai] [--model MODEL] [--repo https://github.com/owner/repo]\n\nEnvironment:\n  SUPRISCODE_URL, SUPRISCODE_PASSWORD, SUPRISCODE_PROVIDER, SUPRISCODE_MODEL");
  process.exit(baseUrl && password ? 0 : 2);
}
const prompt = args.filter((v, i) => !["--url","--password","--provider","--model","--repo"].includes(v) && !(i > 0 && ["--url","--password","--provider","--model","--repo"].includes(args[i-1]))).join(" ").trim();
let task = prompt;
if (!task && stdin.isTTY) {
  const rl = createInterface({ input: stdin, output: stdout });
  task = await rl.question("What should SupriseCode do? ");
  rl.close();
} else if (!task) {
  task = await new Promise((resolve, reject) => {
    let data = "";
    stdin.setEncoding("utf8");
    stdin.on("data", chunk => data += chunk);
    stdin.on("end", () => resolve(data.trim()));
    stdin.on("error", reject);
  });
}
if (!task) { console.error("Provide a task as arguments or stdin."); process.exit(2); }
const response = await fetch(new URL("/api/mobile/chat", baseUrl), {
  method: "POST",
  headers: { "content-type": "application/json", "x-suprisecode-access": password },
  body: JSON.stringify({ prompt: task, provider, model, repositoryUrl })
});
const payload = await response.json().catch(() => ({}));
if (!response.ok) { console.error(payload.error || `SupriseCode server returned HTTP ${response.status}`); process.exit(1); }
console.log(payload.text || "The agent returned an empty response.");
