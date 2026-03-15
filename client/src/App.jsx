import { useState } from 'react'
import Nav      from './components/Nav.jsx'
import Scanner  from './pages/Scanner.jsx'
import Learn    from './pages/Learn.jsx'
import About    from './pages/About.jsx'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('scan')

  return (
    <div className="app">
      <Nav tab={tab} setTab={setTab} />
      <main className="app-main">
        {tab === 'scan'  && <Scanner />}
        {tab === 'learn' && <Learn />}
        {tab === 'about' && <About />}
      </main>
      <footer className="app-footer">
        <span className="mono">PHISHGUARD v1.0</span>
        <span>MIT License · Built for security education</span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </footer>
    </div>
  )
}
