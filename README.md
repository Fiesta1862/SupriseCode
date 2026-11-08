# SupriseCode
Open-source AI coding workspace with a multi-provider agent and isolated remote execution.

## v0.1.0 foundation
- Next.js + TypeScript responsive workspace
- OpenAI, Anthropic, Google Gemini, and OpenRouter model adapters
- Streaming AI agent with file list/read/write and command tools
- Isolated Vercel Sandbox microVM execution
- Import public GitHub repositories over HTTPS
- Server-side API keys; no provider secrets sent to the browser

## Local development
Requires Node.js 22+ and a Vercel account.
```bash
npm install
cp .env.example .env.local
npm run dev
```
Set one or more keys: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENROUTER_API_KEY.
For local Sandbox auth: `npm i -g vercel && vercel login && vercel link && vercel env pull .env.local`.

## Deploy
Import this repository into Vercel, use the Next.js preset, add one or more provider API keys in Project Settings → Environment Variables, then deploy. Vercel Sandbox uses the project's Vercel identity when enabled.

## Safety and limitations
- Commands are restricted by an allowlist; shell chaining, redirection, command substitution, destructive commands, privilege escalation and Git pushes are blocked.
- Project paths are validated.
- Workspaces are ephemeral and stopped after each agent response in this initial release. Download/export and persistent Vercel Drive workspaces are planned.
- GitHub import supports public HTTPS repositories only.
- No authentication or durable conversation storage is included in v0.1.0; do not expose a public deployment without adding rate limits and authentication.
- Sandbox usage may incur Vercel charges. Review your project limits and pricing before public launch.

## License
MIT. See LICENSE.
