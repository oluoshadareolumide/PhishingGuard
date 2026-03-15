import './Nav.css'

const TABS = [
  { id:'scan',  label:'⚡ Scanner' },
  { id:'learn', label:'📚 Learn'   },
  { id:'about', label:'ℹ About'   },
]

export default function Nav({ tab, setTab }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-logo">
          <span className="nav-logo-hex">⬡</span>
          <span className="nav-logo-text">PHISH<span>GUARD</span></span>
        </div>
        <nav className="nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-tab ${tab === t.id ? 'nav-tab--on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="nav-status">
          <span className="status-dot" />
          <span className="status-label">AI Active</span>
        </div>
      </div>
    </header>
  )
}
