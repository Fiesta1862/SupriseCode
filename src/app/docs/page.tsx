import Link from "next/link";

export default function DocsPage() {
  return <main className="site-wrap"><nav className="site-nav"><Link className="site-brand" href="/">SupriseCode</Link><Link href="/">Home</Link><Link href="/download">Downloads</Link></nav>
    <section className="site-hero compact"><span className="site-kicker">DOCUMENTATION</span><h1>Install on your devices. Execute remotely.</h1><p>SupriseCode keeps model keys and command execution on your remote backend. Clients are interfaces; the website is the product and download portal.</p></section>
    <section className="site-grid">
      <article className="site-card"><h2>Android</h2><p>Install the Kotlin APK from the direct download page. Enter your HTTPS backend URL and app access password in Settings. Current CI artifact is a debug build until a signed release is configured.</p></article>
      <article className="site-card"><h2>iPhone and iPad</h2><p>Open the website in Safari → Share → Add to Home Screen. This is an installable PWA, not an App Store IPA. iOS requires Apple signing and distribution for native apps.</p></article>
      <article className="site-card"><h2>Windows, macOS, Linux</h2><p>Use the browser's Install app action to add the PWA to your desktop. The terminal CLI is also available on all three platforms. Native desktop packages are planned, not published in this release.</p></article>
      <article className="site-card" id="terminal"><h2>Terminal: npm or Bun</h2><pre><code>npm install --global @suprisecode/cli{"\n"}# or{"\n"}bun add --global @suprisecode/cli</code></pre><pre><code>export SUPRISCODE_URL=https://your-deployment.example{"\n"}export SUPRISCODE_PASSWORD=your-password{"\n"}suprisecode "Explain this project"</code></pre></article>
      <article className="site-card"><h2>Terminal: curl</h2><pre><code>curl -fsSL https://suprisecode.vercel.app/install.sh | sh</code></pre><p>Requires npm or Bun. The installer installs the CLI package; it does not execute untrusted scripts from a project.</p></article>
      <article className="site-card"><h2>Homebrew</h2><p>Formula template: <code>packaging/homebrew/suprisecode.rb</code>. Publish the npm package, replace the placeholder SHA-256, then submit the formula to a tap. Not published yet.</p></article>
      <article className="site-card"><h2>Arch Linux / paru</h2><pre><code>paru -S suprisecode-cli</code></pre><p>PKGBUILD template is in <code>packaging/aur</code>. This command becomes available after the AUR package is submitted; it is not published yet.</p></article>
      <article className="site-card"><h2>SDK and API</h2><p>The current stable integration surface is the remote JSON endpoint <code>POST /api/mobile/chat</code>. It accepts provider, model, repositoryUrl, and prompt fields with the access header. A versioned public SDK package and full API reference are not released yet.</p></article>
      <article className="site-card"><h2>Backend deployment</h2><p>Deploy the Next.js backend to Vercel. Set <code>APP_ACCESS_PASSWORD</code>, at least one provider key, and enable Vercel Sandbox. Provider keys remain server-side.</p></article>
      <article className="site-card"><h2>Remote workspace limitations</h2><p>Workspaces are temporary per request. Durable project storage, user accounts, GitHub write-back, and multi-turn sessions are not yet included.</p></article>
    </section><footer className="site-footer"><Link href="/download">Downloads</Link> · SupriseCode · MIT License</footer></main>;
}
