# SupriseCode

Open-source AI coding agent with a native Android client, a separate product website, and a remote Vercel backend.

## Project architecture

- **Android:** Kotlin + Jetpack Compose app in `android/`. GitHub Actions builds a debug APK.
- **Website:** Next.js product landing page, documentation at `/docs`, and APK download page at `/download`.
- **Backend:** Next.js API routes deployed to Vercel. Multi-provider model support for OpenAI, Anthropic, Google Gemini, and OpenRouter.
- **Execution:** Remote project workspaces run in isolated Vercel Sandbox environments. The Android device does not execute agent shell commands.

## Android APK

The Android app requires Android 8.0 (API 26) or newer.

1. Open the GitHub Actions tab and select **Android APK**.
2. Download the `SupriseCode-debug-apk` artifact from a successful run.
3. Install `app-debug.apk` on your Android device.
4. Open Settings in the app and enter your deployed HTTPS backend URL and `APP_ACCESS_PASSWORD`.

A release APK can later be published through GitHub Releases. Do not distribute debug builds as production-signed releases.

## Website

The website is the product/download/docs surface. It is not the coding console.

- `/` — product landing page
- `/docs` — setup guide
- `/download` — Android download page

Set `NEXT_PUBLIC_ANDROID_APK_URL` to a trusted APK release URL to enable the direct download button. Until then, the page links to GitHub Releases.

## Backend setup

Requires Node.js 22+ and a Vercel project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set:
- `APP_ACCESS_PASSWORD` — long, unique shared access password
- At least one provider key: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, or `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_ANDROID_APK_URL` — optional direct APK URL for the website

Enable Vercel Sandbox for the project. For local Sandbox auth, install the Vercel CLI, run `vercel login`, `vercel link`, and `vercel env pull .env.local`.

## Current limitations

- Remote workspaces are temporary and discarded after each agent request.
- The current Android client sends one prompt per request; persistent multi-turn server sessions are not implemented yet.
- Public GitHub repository import only.
- No individual user accounts, durable project storage, GitHub write-back, ZIP export, or signed production APK release yet.
- The Android APK workflow produces a debug APK artifact. A signed release requires a separately configured signing key stored as GitHub Actions secrets.
- The Android app connects to your own backend deployment. Provider keys are not stored in the APK.

## Safety and costs

The backend requires the shared access password and runs project commands through an allowlist inside a remote Sandbox. Never embed provider API keys in the Android app. Sandbox and model-provider usage may incur charges; review your account limits before deploying publicly.

## License

MIT. See [LICENSE](LICENSE).
