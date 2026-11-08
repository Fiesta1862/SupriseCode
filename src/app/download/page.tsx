import Link from "next/link";

export default function DownloadPage() {
  const apk = process.env.NEXT_PUBLIC_ANDROID_APK_URL;
  return <main className="site-wrap"><nav className="site-nav"><Link className="site-brand" href="/">✳ SupriseCode</Link><Link href="/docs">Docs</Link><Link href="/">Home</Link></nav><section className="site-hero compact"><span className="site-kicker">ANDROID APP</span><h1>SupriseCode, on your phone.</h1><p>Install the native Android app and connect it to your own remote coding backend.</p><div className="site-actions">{apk ? <a className="site-button" href={apk}>Download APK ↗</a> : <span className="site-button disabled">APK release coming soon</span>}<a className="site-button secondary" href="https://github.com/Fiesta1862/SupriseCode/releases">GitHub releases ↗</a></div><p className="site-small">Only install APKs published from the official SupriseCode repository. Android may ask you to confirm installation from your browser.</p></section><footer className="site-footer">SupriseCode · Open source · MIT License</footer></main>;
}
