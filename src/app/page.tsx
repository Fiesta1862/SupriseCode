import Link from "next/link";

const features = [
  ["Native Android app", "A focused Kotlin app with an installable APK and a mobile-first coding assistant."],
  ["Remote coding agent", "Run project tasks in isolated Vercel Sandbox environments instead of executing code on your phone."],
  ["Multiple AI providers", "Connect OpenAI, Anthropic, Google Gemini, or OpenRouter using server-side API keys."],
  ["Your GitHub projects", "Start a remote workspace from a public GitHub repository and ask the agent to inspect or change code."]
];

export default function Home() {
  return <main className="site-wrap">
    <nav className="site-nav"><Link className="site-brand" href="/">✳ SupriseCode</Link><div><Link href="/docs">Documentation</Link><Link href="/download">Download</Link><a href="https://github.com/Fiesta1862/SupriseCode">GitHub ↗</a></div></nav>
    <section className="site-hero">
      <span className="site-kicker">OPEN-SOURCE AI CODING AGENT</span>
      <h1>Your coding workspace.<br/><span>Now on Android.</span></h1>
      <p>Ask, build, and improve projects from your phone. SupriseCode pairs a native Android app with a remote AI coding backend powered by isolated workspaces.</p>
      <div className="site-actions"><Link className="site-button" href="/download">Get the Android app ↗</Link><a className="site-button secondary" href="https://github.com/Fiesta1862/SupriseCode">Explore source code</a></div>
      <div className="site-preview"><div className="preview-top"><span>✳ SupriseCode</span><span>REMOTE WORKSPACE · READY</span></div><div className="preview-body"><aside><b>WORKSPACE</b><small>⌂ Home</small><small>▤ Projects</small><small>⌘ GitHub</small><small>⚙ Settings</small></aside><div className="preview-main"><span className="site-kicker">AI CODING ASSISTANT</span><h2>What are we building today?</h2><p>Describe a feature, fix a bug, or bring in a repository.</p><div className="preview-prompt">Help me understand this project and find the next improvement… <b>↑</b></div><div className="preview-tags"><span>Multi-provider AI</span><span>Remote execution</span><span>Android-first</span></div></div></div></div>
    </section>
    <section className="site-section"><span className="site-kicker">THE TOOLKIT</span><h2>Built for coding from anywhere.</h2><div className="site-grid">{features.map(([title,description])=><article className="site-card" key={title}><div className="feature-mark">✳</div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="site-callout"><div><span className="site-kicker">OPEN SOURCE · MIT</span><h2>Install the app.<br/>Connect your backend.</h2><p>Host the API on Vercel, configure your model provider, then connect the Android app to your deployment.</p></div><Link className="site-button" href="/docs">Read setup guide ↗</Link></section>
    <footer className="site-footer"><span>✳ SupriseCode</span><span>Open source AI coding workspace · MIT License</span><span><Link href="/docs">Docs</Link> · <Link href="/download">Download</Link> · <a href="https://github.com/Fiesta1862/SupriseCode">GitHub</a></span></footer>
  </main>;
}
