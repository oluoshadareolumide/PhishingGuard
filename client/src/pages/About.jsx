import './About.css'

const STACK = [
  { layer:'Frontend', items:['React 18', 'Vite', 'Plain CSS'] },
  { layer:'Backend',  items:['Node.js', 'Express', 'Helmet', 'express-rate-limit'] },
  { layer:'AI',       items:['Anthropic Claude (claude-sonnet-4)'] },
  { layer:'Deploy',   items:['Any Node host (Railway, Render, Fly.io, VPS)'] },
]

const ENDPOINTS = [
  { method:'POST', path:'/api/analyze',       desc:'Analyse content for threats. Body: { content, type }' },
  { method:'GET',  path:'/api/educate/threats',desc:'Returns the full threat-type library (JSON).' },
  { method:'POST', path:'/api/educate/ask',   desc:'Ask a cybersecurity question. Body: { question }' },
  { method:'GET',  path:'/api/health',         desc:'Health check.' },
]

export default function About() {
  return (
    <div className="about fade-up">

      <div className="about-hero">
        <span className="eyebrow-a mono">ABOUT PHISHGUARD</span>
        <h1 className="about-title">Open-source threat detection<br/>for everyone.</h1>
        <p className="about-intro">
          PhishGuard is a lightweight, full-stack application that uses the Anthropic Claude API to
          analyse emails, messages, and URLs for phishing, scams, and social-engineering attacks in
          real time — with plain-English explanations so users actually learn, not just get warned.
        </p>
      </div>

      {/* Tech stack */}
      <section className="about-section">
        <h2 className="section-h mono">TECH STACK</h2>
        <div className="stack-grid">
          {STACK.map(s => (
            <div key={s.layer} className="stack-card">
              <div className="stack-layer mono">{s.layer}</div>
              <ul className="stack-items">
                {s.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* API reference */}
      <section className="about-section">
        <h2 className="section-h mono">API REFERENCE</h2>
        <div className="api-table">
          {ENDPOINTS.map(e => (
            <div key={e.path} className="api-row">
              <span className={`api-method mono method-${e.method.toLowerCase()}`}>{e.method}</span>
              <span className="api-path mono">{e.path}</span>
              <span className="api-desc">{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Setup */}
      <section className="about-section">
        <h2 className="section-h mono">QUICK START</h2>
        <div className="code-block">
          <pre>{`# 1. Clone
git clone https://github.com/YOUR_USERNAME/phishguard
cd phishguard

# 2. Install all dependencies
npm run setup

# 3. Add your Anthropic API key
cp server/.env.example server/.env
# Edit server/.env → set ANTHROPIC_API_KEY=sk-ant-...

# 4. Run in development
npm run dev
# → API  http://localhost:3001
# → App  http://localhost:5173`}</pre>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="disclaimer">
        <span className="mono disc-label">NOTE</span>
        <p>
          PhishGuard is an educational tool. It provides AI-based analysis to help users
          identify potential threats, but should not be relied on as a sole security measure.
          Always use up-to-date antivirus software and follow your organisation's security policies.
        </p>
      </div>
    </div>
  )
}
