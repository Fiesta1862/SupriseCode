# SupriseCode

Open-source remote AI coding agent: Kotlin Android client, installable web app for iPhone and desktop, CLI for terminals, and a separate product/download/docs website.

## Platform support

| Platform | Delivery |
|---|---|
| Android | Native Kotlin APK (debug workflow currently; signed release still required) |
| iPhone/iPad | Installable PWA via Safari → Share → Add to Home Screen; no App Store IPA yet |
| Windows, macOS, Linux desktop | Installable PWA in supported browsers; native desktop installers are not yet published |
| Terminal | Node.js/npm and Bun CLI package |
| Homebrew | Formula template in `packaging/homebrew`; publish after npm package release and checksum update |
| Arch Linux / paru | AUR PKGBUILD template in `packaging/aur`; publish after package metadata is finalized |
| curl | `curl -fsSL https://suprisecode.vercel.app/install.sh | sh` (requires npm or Bun already installed) |

## Architecture

- **Product website:** Next.js pages at `/`, `/docs`, and `/download`; this is the marketing, docs, and installer surface, not the coding console.
- **Web app:** responsive installable PWA for mobile and desktop browsers.
- **Android:** Kotlin + Jetpack Compose native app.
- **CLI:** `packages/cli`, calling the remote JSON API. No local agent shell execution.
- **Backend:** Next.js API on Vercel, multi-provider AI adapters, isolated Vercel Sandbox execution.
- **Execution:** remote only. The client never receives provider API keys.

## Install CLI

```sh
npm install --global @suprisecode/cli
# or
bun add --global @suprisecode/cli
```

Then configure:

```sh
export SUPRISCODE_URL="https://your-deployment.example"
export SUPRISCODE_PASSWORD="your-app-access-password"
suprisecode "Explain this repository" --repo https://github.com/owner/repo
```

One-line installer (npm or Bun must already be installed):

```sh
curl -fsSL https://suprisecode.vercel.app/install.sh | sh
```

Package publication requires an npm organization/package owner and an `NPM_TOKEN` GitHub Actions secret. Homebrew and AUR metadata are templates, not published packages yet.

## Install on iPhone and desktop

Open the deployed website in Safari on iPhone/iPad, tap Share, then **Add to Home Screen**. On Windows, macOS, and Linux, open the site in a supported browser and choose its **Install app** option. These install the web app, not a native signed desktop binary.

## Direct downloads

The website reads direct installer URLs from deployment environment variables:
- `NEXT_PUBLIC_ANDROID_APK_URL`
- `NEXT_PUBLIC_WINDOWS_URL`
- `NEXT_PUBLIC_MACOS_URL`
- `NEXT_PUBLIC_LINUX_URL`

Point these to HTTPS files hosted on a release CDN or Vercel Blob. The download page links directly to those files; it does not send users to GitHub. Do not set a URL until the corresponding signed/tested installer exists. iPhone installation is through the PWA flow; iOS does not allow a website to silently install an IPA.

## Backend setup

Requires Node.js 22+ and a Vercel project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `APP_ACCESS_PASSWORD`, at least one provider key (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, or `OPENROUTER_API_KEY`), and enable Vercel Sandbox.

## Current limitations

- Android workflow currently creates a debug APK; production distribution needs signing secrets and a tested release.
- iPhone support is PWA, not App Store native.
- Native Windows/macOS/Linux desktop installers are not built yet; PWA and CLI cover these platforms meanwhile.
- npm package, Homebrew formula, and AUR package are not published yet; templates/workflow are present.
- Remote workspaces are temporary; persistent project sessions/storage and GitHub write-back are not implemented.
- Set direct download URLs only after publishing trusted binaries. No GitHub download redirect is used by the product download page.

## Safety and costs

Never embed provider API keys in client apps. Sandbox and model usage may incur charges. Review provider and Vercel limits before public deployment.

## License

MIT. See [LICENSE](LICENSE).
