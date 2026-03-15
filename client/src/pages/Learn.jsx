import { useState, useEffect } from 'react'
import './Learn.css'

const FALLBACK_THREATS = {
  phishing:              { title:'Phishing',              icon:'🎣', summary:'Fake emails / pages impersonating trusted brands to steal credentials.', tips:['Check the real sender address — display names lie.','Hover links before clicking to reveal the true URL.','Legitimate companies never ask for your password by email.','Urgency & fear are manipulation tactics — slow down.'] },
  scam:                  { title:'Online Scams',          icon:'💸', summary:'Deceptive schemes tricking victims into handing over money or data.',    tips:['If it sounds too good to be true, it always is.','Never pay upfront fees to claim a prize.','Gift-card payments are a guaranteed scam signal.','Verify businesses via official websites — not provided links.'] },
  social_engineering:    { title:'Social Engineering',    icon:'🎭', summary:'Psychological manipulation exploiting human trust and authority bias.',  tips:['Verify unsolicited contact through official channels.','Attackers impersonate IT, HR, or senior staff.','It\'s always OK to pause, verify, then act.','Pressure to act NOW is a red flag.'] },
  malware:               { title:'Malware',               icon:'🦠', summary:'Malicious software delivered via links, attachments, or downloads.',     tips:['Never open unexpected attachments — even from known senders.','Keep your OS & software fully updated.','Use reputable antivirus software.','Back up data regularly (offline or cloud).'] },
  credential_harvesting: { title:'Credential Harvesting', icon:'🔑', summary:'Fake login pages designed to capture your username and password.',       tips:['Check the exact domain in the URL bar before logging in.','Password managers won\'t autofill on fake sites.','Enable 2FA on all important accounts.','HTTPS ≠ safe — phishers use it too.'] },
}

const QUESTIONS = [
  'How can I spot a phishing email?',
  'What is two-factor authentication?',
  'Is this link safe to click?',
  'How do ransomware attacks start?',
  'What should I do after clicking a phishing link?',
]

export default function Learn() {
  const [threats,    setThreats]  = useState(FALLBACK_THREATS)
  const [active,     setActive]   = useState('phishing')
  const [question,   setQuestion] = useState('')
  const [answer,     setAnswer]   = useState(null)
  const [asking,     setAsking]   = useState(false)
  const [qaError,    setQaError]  = useState(null)

  useEffect(() => {
    fetch('/api/educate/threats')
      .then(r => r.json())
      .then(d => d.threats && setThreats(d.threats))
      .catch(() => {/* use fallback */})
  }, [])

  const ask = async (q) => {
    const text = (q || question).trim()
    if (!text || asking) return
    setAsking(true); setAnswer(null); setQaError(null)
    try {
      const res  = await fetch('/api/educate/ask', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ question: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setAnswer(data.answer)
    } catch (e) {
      setQaError(e.message)
    } finally {
      setAsking(false)
    }
  }

  const t = threats[active] || {}

  return (
    <div className="learn fade-up">

      <div className="learn-head">
        <span className="eyebrow mono">THREAT LIBRARY</span>
        <h1 className="learn-title">Know Your Enemy</h1>
        <p className="learn-sub">Understand the most common online attack techniques — and how to defend against them.</p>
      </div>

      {/* ── Threat browser ── */}
      <div className="threat-browser">
        {/* Sidebar */}
        <div className="threat-nav">
          {Object.entries(threats).map(([key, val]) => (
            <button
              key={key}
              className={`threat-nav-btn ${active === key ? 'threat-nav-btn--on':''}`}
              onClick={() => setActive(key)}
            >
              <span className="tnb-icon">{val.icon}</span>
              <span className="tnb-label">{val.title}</span>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="threat-detail" key={active}>
          <div className="td-icon">{t.icon}</div>
          <h2 className="td-title">{t.title}</h2>
          <p className="td-summary">{t.summary}</p>

          <div className="td-tips-head mono">DEFENCE TIPS</div>
          <ul className="td-tips">
            {(t.tips || []).map((tip, i) => (
              <li key={i} className="td-tip">
                <span className="tip-num mono">{String(i+1).padStart(2,'0')}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Q&A ── */}
      <div className="qa-section">
        <div className="qa-head">
          <span className="eyebrow mono">ASK PHISHGUARD AI</span>
          <h2 className="qa-title">Got a security question?</h2>
        </div>

        <div className="qa-quick">
          {QUESTIONS.map(q => (
            <button key={q} className="quick-btn" onClick={() => { setQuestion(q); ask(q) }}>
              {q}
            </button>
          ))}
        </div>

        <div className="qa-input-row">
          <input
            className="qa-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Ask anything about online safety…"
            maxLength={500}
          />
          <button className={`qa-btn ${asking?'qa-btn--busy':''}`} disabled={!question.trim()||asking} onClick={()=>ask()}>
            {asking ? <span className="spinner-sm"/> : '→'}
          </button>
        </div>

        {qaError && <p className="qa-error">{qaError}</p>}

        {answer && (
          <div className="qa-answer fade-up">
            <span className="qa-label mono">PHISHGUARD AI</span>
            <div className="qa-text">
              {answer.split('\n').filter(Boolean).map((p,i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
