const express  = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are PhishGuard, an expert cybersecurity AI.
Analyse the provided content for phishing, scams, or social-engineering threats.

Respond ONLY with a single valid JSON object — no markdown fences, no extra text:
{
  "riskScore":  <integer 0-100>,
  "riskLevel":  <"safe"|"low"|"medium"|"high"|"critical">,
  "verdict":    "<one clear sentence>",
  "threatType": <null | "phishing"|"scam"|"malware"|"social_engineering"|"fake_website"|"credential_harvesting"|"advance_fee_fraud"|"tech_support_scam"|"romance_scam"|"spam">,
  "redFlags": [
    { "flag": "<short label>", "why": "<explanation>" }
  ],
  "safeIndicators": ["<string>"],
  "recommendations": ["<actionable string>"],
  "educationalNote": "<2-3 sentences explaining the attack technique>"
}

Risk score guide: 0-20 safe · 21-40 low · 41-60 medium · 61-80 high · 81-100 critical.
Never produce false positives for clearly benign content.`;

router.post('/', async (req, res) => {
  const { content, type = 'other' } = req.body;

  if (!content || typeof content !== 'string')
    return res.status(400).json({ error: 'content is required.' });
  if (content.trim().length < 5)
    return res.status(400).json({ error: 'Content too short.' });
  if (content.length > 5000)
    return res.status(400).json({ error: 'Max 5 000 characters.' });

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Analyse this ${type}:\n\n${content.trim()}` }],
    });

    const raw = msg.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    let analysis;
    try { analysis = JSON.parse(raw); }
    catch { return res.status(500).json({ error: 'AI response parse error — try again.' }); }

    res.json({ success: true, analysis, analyzedAt: new Date().toISOString() });

  } catch (err) {
    console.error('analyze error:', err.message);
    if (err.status === 401) return res.status(500).json({ error: 'Invalid API key.' });
    res.status(500).json({ error: 'Analysis failed — try again.' });
  }
});

module.exports = router;
