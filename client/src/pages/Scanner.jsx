import { useState } from 'react'
import RiskMeter from '../components/RiskMeter.jsx'
import './Scanner.css'

const TYPES = [
  { value:'email',   label:'📧 Email'    },
  { value:'message', label:'💬 Message'  },
  { value:'url',     label:'🔗 URL'      },
  { value:'website', label:'🌐 Website'  },
  { value:'other',   label:'📄 Other'    },
]

const SAMPLES = [
  {
    label: 'Phishing email',
    type:  'email',
    content:
`From: security@paypa1-alert.com
Subject: URGENT: Your account has been suspended!

Dear Valued Customer,

We detected unusual sign-in activity on your PayPal account. To avoid permanent suspension you must verify your identity within 24 hours:

http://paypal-secure-verify.tk/confirm?token=839xA

Failure to act will result in permanent account closure.

PayPal Security Team`,
  },
  {
    label: 'Prize scam',
    type: 'message',
    content:
`Congratulations! You have been randomly selected to receive $1,000,000 from our international lottery.

To claim your prize send a $200 processing fee via Western Union to James Williams, Lagos Nigeria.

Reply with your full name, address and bank details to proceed. This is 100% legitimate.`,
  },
  {
    label: 'Legit message',
    type: 'email',
    content:
`Hi Sarah,

Just following up on our Tuesday meeting. I've attached the project brief as discussed — let me know if anything needs adjusting.

Happy to jump on a call later this week if useful.

Best, Tom`,
  },
]

const LEVEL_META = {
  safe:     { color:'var(--safe)',     bg:'var(--safe-bg)',     label:'SAFE'     },
  low:      { color:'var(--low)',      bg:'var(--low-bg)',      label:'LOW RISK' },
  medium:   { color:'var(--medium)',   bg:'var(--medium-bg)',   label:'MEDIUM'   },
  high:     { color:'var(--high)',     bg:'var(--high-bg)',     label:'HIGH'     },
  critical: { color:'var(--critical)', bg:'var(--critical-bg)', label:'CRITICAL' },
}

export default function Scanner() {
  const [content, setContent]   = useState('')
  const [type,    setType]      = useState('email')
  const [loading, setLoading]   = useState(false)
  const [result,  setResult]    = useState(null)
  const [error,   setError]     = useState(null)

  const load = s => { setContent(s.content); setType(s.type); setResult(null); setError(null) }
  const clear = () => { setContent(''); setResult(null); setError(null) }

  const run = async () => {
    if (!content.trim() || loading) return
    setLoading(true); setResult(null); setError(null)
    try {
      const res  = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.analysis)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const meta = result ? (LEVEL_META[result.riskLevel] || LEVEL_META.safe) : null

  return (
    <div className="scanner fade-up">

      {/* ── Page header ── */}
      <div className="sc-head">
        <span className="sc-eyebrow mono">THREAT SCANNER</span>
        <h1 className="sc-title">Is this suspicious?</h1>
        <p className="sc-sub">Paste any email, message, URL or text. Get an instant AI-powered verdict with a plain-English explanation.</p>
      </div>

      {/* ── Input panel ── */}
      <div className="sc-panel">

        {/* Type pills */}
        <div className="type-row">
          {TYPES.map(t => (
            <button key={t.value}
              className={`type-pill ${type === t.value ? 'type-pill--on':''}`}
              onClick={() => setType(t.value)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          className="sc-textarea"
          value={content}
          onChange={e => { setContent(e.target.value); setResult(null); setError(null) }}
          placeholder={`Paste ${type} content here…`}
          rows={11}
          maxLength={5000}
        />

        {/* Foot row */}
        <div className="sc-foot">
          <div className="samples-row">
            <span className="samples-label mono">Try:</span>
            {SAMPLES.map(s => (
              <button key={s.label} className="sample-pill" onClick={() => load(s)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="foot-right">
            <span className="char-count mono">{content.length}/5000</span>
            {content && <button className="clear-btn" onClick={clear}>✕ clear</button>}
          </div>
        </div>

        {/* Submit */}
        <button
          className={`scan-btn ${loading ? 'scan-btn--busy':''}`}
          disabled={!content.trim() || loading}
          onClick={run}
        >
          {loading
            ? <><span className="spinner" /> Analysing…</>
            : <>⚡ Run Threat Scan</>}
        </button>

        {error && <div className="err-box"><span className="mono">ERR ▸</span> {error}</div>}
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="results fade-up">

          {/* Verdict banner */}
          <div className="verdict" style={{ borderColor: meta.color, background: meta.bg }}>
            <div className="verdict-left">
              <span className="verdict-badge mono" style={{ color: meta.color, borderColor: meta.color }}>
                {meta.label}
              </span>
              <div>
                <p className="verdict-text">{result.verdict}</p>
                {result.threatType && (
                  <p className="verdict-type mono">
                    ▸ {result.threatType.replace(/_/g,' ')}
                  </p>
                )}
              </div>
            </div>
            <RiskMeter score={result.riskScore} level={result.riskLevel} />
          </div>

          {/* Cards grid */}
          <div className="cards">

            {/* Red flags */}
            {result.redFlags?.length > 0 && (
              <div className="card card--red">
                <h3 className="card-title">🚩 Red Flags</h3>
                <ul className="flag-list">
                  {result.redFlags.map((f,i) => (
                    <li key={i} className="flag-item">
                      <span className="flag-name">{f.flag}</span>
                      <span className="flag-why">{f.why}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safe indicators */}
            {result.safeIndicators?.length > 0 && (
              <div className="card card--green">
                <h3 className="card-title">✅ Safe Indicators</h3>
                <ul className="plain-list">
                  {result.safeIndicators.map((s,i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="card card--blue">
                <h3 className="card-title">💡 What to do</h3>
                <ol className="num-list">
                  {result.recommendations.map((r,i) => <li key={i}>{r}</li>)}
                </ol>
              </div>
            )}

            {/* Educational note */}
            {result.educationalNote && (
              <div className="card card--amber">
                <h3 className="card-title">📖 How this attack works</h3>
                <p className="edu-text">{result.educationalNote}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
