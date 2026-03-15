# 🛡️ PhishGuard

> AI-powered phishing & online scam detection — with plain-English explanations.

PhishGuard is a lightweight full-stack web app that uses the **Anthropic Claude API** to analyse emails, messages, URLs, and website content for phishing, scams, and social-engineering attacks — in real time, with educational explanations so users understand the threat.

---

## ✨ Features

- **⚡ Instant threat scanning** — paste any suspicious content, get a verdict in seconds
- **🎯 Risk scoring** — 0–100 score with Safe / Low / Medium / High / Critical levels
- **🚩 Red flag breakdown** — exactly *why* something is suspicious
- **💡 Actionable recommendations** — what to do next
- **📖 Educational notes** — learn how each attack technique works
- **📚 Threat library** — browsable guide to phishing, scams, malware & more
- **🤖 AI Q&A** — ask any cybersecurity question in plain English
- **🔒 Rate limiting & security headers** built in

---

## 🗂️ Project Structure

```
phishguard/
├── package.json            ← root scripts (dev/build/setup)
├── server/
│   ├── index.js            ← Express (helmet, CORS, rate-limit)
│   ├── .env.example
│   └── routes/
│       ├── analyze.js      ← POST /api/analyze
│       └── educate.js      ← GET /api/educate/threats · POST /api/educate/ask
└── client/
    ├── vite.config.js      ← proxies /api → :3001
    └── src/
        ├── components/     ← Nav, RiskMeter
        └── pages/          ← Scanner, Learn, About
```

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ · [Anthropic API key](https://console.anthropic.com/)

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USERNAME/phishguard.git
cd phishguard
npm run setup

# 2. Add your API key
cp server/.env.example server/.env
# Edit server/.env → ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
npm run dev
# App  → http://localhost:5173
# API  → http://localhost:3001
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Analyse content. Body: `{ content, type }` |
| `GET` | `/api/educate/threats` | Threat-type library |
| `POST` | `/api/educate/ask` | Q&A. Body: `{ question }` |
| `GET` | `/api/health` | Health check |

**`/api/analyze` response shape:**
```json
{
  "analysis": {
    "riskScore": 87,
    "riskLevel": "critical",
    "verdict": "Phishing email impersonating PayPal.",
    "threatType": "phishing",
    "redFlags": [{ "flag": "Spoofed domain", "why": "paypa1-alert.com ≠ paypal.com" }],
    "safeIndicators": [],
    "recommendations": ["Do not click links", "Report to your email provider"],
    "educationalNote": "Attackers register lookalike domains to trick users..."
  }
}
```

---

## 🚢 Deployment

**Railway (easiest):** Push to GitHub → New Railway project → Deploy from repo → set env vars.

**Render:** Web Service for `server/` (`npm start`) + Static Site for `client/` (`npm run build`, publish `dist/`).

**VPS:** Build client (`npm run build`), serve `client/dist` as static files from Express, run with PM2.

---

## 🔒 Security

- Rate limited: 40 req / 15 min / IP
- Helmet.js security headers
- Input capped at 5 000 characters
- CORS restricted to `CLIENT_URL`
- Zero data persistence

---

## 📄 License

MIT © 2025
