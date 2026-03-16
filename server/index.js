require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');

const analyzeRouter  = require('./routes/analyze');
const educateRouter  = require('./routes/educate');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Security ── */
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '10kb' }));

/* ── Rate limit: 40 req / 15 min ── */
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { error: 'Too many requests — please wait a moment.' },
}));

/* ── Routes ── */
app.use('/api/analyze', analyzeRouter);
app.use('/api/educate', educateRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* ── Errors ── */
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () =>
  console.log(`🛡️  PhishGuard API → http://localhost:${PORT}`)
);
