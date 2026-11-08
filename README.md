# SupriseCode
Open-source AI coding workspace with a multi-provider agent and isolated remote execution.

## v0.1.0 foundation
- Next.js + TypeScript responsive workspace
- OpenAI, Anthropic, Google Gemini, and OpenRouter adapters
- Streaming agent with list/read/write file and safe command tools
- Isolated Vercel Sandbox microVM execution
- Import public GitHub repositories over HTTPS
- Server-side provider keys and required shared access password

## Local development
Requires Node.js 22+ and a Vercel account.
```bash
npm install
cp .env.example .env.local
npm run dev
```
Set `APP_ACCESS_PASSWORD` and at least one provider key: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, or `OPENROUTER_API_KEY`.
For local Sandbox auth: `npm i -g vercel && vercel login && vercel link && vercel env pull .env.local`.

## Deploy to Vercel
Import this repository into Vercel, use the Next.js preset, set `APP_ACCESS_PASSWORD` and one or more provider keys in Project Settings → Environment Variables, then deploy. Vercel Sandbox uses the project's Vercel identity when enabled.

## Safety and limitations
- API requests require the shared access password; use a long unique password and do not share it publicly.
- Commands are restricted by an allowlist; shell chaining, redirection, command substitution, destructive commands, privilege escalation and Git pushes are blocked.
- Project paths are validated. Agent code executes in an isolated Vercel Sandbox, not the Next.js server.
- Workspaces are ephemeral and stopped after each agent response. Persistent Drive workspaces, editor/file browser, ZIP import/export, and GitHub write-back are planned.
- GitHub import currently supports public HTTPS repositories only.
- No individual user accounts or durable conversation storage in this first release. The shared password is a basic access gate, not a multi-user identity system.
- Sandbox usage and model API usage may incur charges. Check your provider and Vercel limits before sharing the deployment.

## License
MIT. See LICENSE.
