import Link from "next/link";

const downloads = [
  ["Android APK", "NEXT_PUBLIC_ANDROID_APK_URL", process.env.NEXT_PUBLIC_ANDROID_APK_URL],
  ["Windows installer", "NEXT_PUBLIC_WINDOWS_URL", process.env.NEXT_PUBLIC_WINDOWS_URL],
  ["macOS installer", "NEXT_PUBLIC_MACOS_URL", process.env.NEXT_PUBLIC_MACOS_URL],
  ["Linux package", "NEXT_PUBLIC_LINUX_URL", process.env.NEXT_PUBLIC_LINUX_URL]
] as const;

export default function DownloadPage() {
  return <main className="site-wrap">
    <nav className="site-nav"><Link className="site-brand" href="/"><img className="brand-icon" src="/suprisecode-mark.svg" alt="" /> SupriseCode</Link><Link href="/docs">Docs</Link><Link href="/">Home</Link></nav>
    <section className="site-hero compact">
      <span className="site-kicker">DOWNLOADS · OFFICIAL DISTRIBUTION</span>
      <h1>Get SupriseCode for your platform.</h1>
      <p>Choose a published installer. Downloads are served directly from the configured release host, not through a GitHub page.</p>
      <div className="site-grid">
        {downloads.map(([label, env, url]) => <article className="site-card" key={env}>
          <h2>{label}</h2>
          {url ? <a className="site-button" href={url}>Download {label} ↓</a> : <span className="site-small">Installer not published yet · Configure {env}</span>}
        </article>)}
        <article className="site-card"><h2>iPhone and iPad</h2><p>Open this website in Safari, tap Share, then choose Add to Home Screen. This installs the web app; an App Store app is not published yet.</p></article>
        <article className="site-card"><h2>Windows, macOS, Linux</h2><p>Use your browser's Install app option to add the SupriseCode web app to your desktop. Native desktop installers are not published yet.</p></article>
      </div>
      <p className="site-small">Only install signed releases from the official SupriseCode distribution domain. A download link appears only after its matching release URL is configured.</p>
      <div className="site-actions"><Link className="site-button secondary" href="/docs#terminal">Terminal installation</Link></div>
    </section>
    <footer className="site-footer">SupriseCode · Open source · MIT License</footer>
  </main>;
}
