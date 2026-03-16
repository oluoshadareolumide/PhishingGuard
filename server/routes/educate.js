const express  = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const THREATS = {
  phishing: {
    title: 'Phishing', icon: '🎣',
    summary: 'Fake emails / pages impersonating trusted brands to steal credentials.',
    tips: [
      'Check the real sender address — display names lie.',
      'Hover links before clicking to reveal the true URL.',
      'Legitimate companies never ask for your password by email.',
      'Urgency & fear are manipulation tactics — slow down.',
    ],
  },
  scam: {
    title: 'Online Scams', icon: '💸',
    summary: 'Deceptive schemes tricking victims into handing over money or data.',
    tips: [
      'If it sounds too good to be true, it always is.',
      'Never pay upfront fees to claim a prize.',
      'Gift-card payments are a guaranteed scam signal.',
      'Verify businesses via official websites — not provided links.',
    ],
  },
  social_engineering: {
    title: 'Social Engineering', icon: '🎭',
    summary: 'Psychological manipulation exploiting human trust and authority bias.',
    tips: [
      'Verify unsolicited contact through official channels.',
      'Attackers impersonate IT, HR, or senior staff.',
      'It\'s always OK to pause, verify, then act.',
      'Pressure to act NOW is a red flag.',
    ],
  },
  malware: {
    title: 'Malware', icon: '🦠',
    summary: 'Malicious software delivered via links, attachments, or downloads.',
    tips: [
      'Never open unexpected attachments — even from known senders.',
      'Keep your OS & software fully updated.',
      'Use reputable antivirus software.',
      'Back up data regularly (offline or cloud).',
    ],
  },
  credential_harvesting: {
    title: 'Credential Harvesting', icon: '🔑',
    summary: 'Fake login pages designed to capture your username and password.',
    tips: [
      'Check the exact domain in the URL bar before logging in.',
      'Password managers won\'t autofill on fake sites.',
      'Enable 2FA on all important accounts.',
      'HTTPS ≠ safe — phishers use HTTPS too.',
    ],
  },
};

router.get('/threats', (_req, res) => res.json({ threats: THREATS }));

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string' || question.trim().length < 3)
    return res.status(400).json({ error: 'A valid question is required.' });
  if (question.length > 500)
    return res.status(400).json({ error: 'Max 500 characters.' });

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: `You are PhishGuard's cybersecurity educator. Give concise, practical answers (2-3 short paragraphs) about online safety, phishing, and scams. If the question is unrelated to cybersecurity, politely redirect to security topics.`,
      messages: [{ role: 'user', content: question.trim() }],
    });

    const answer = msg.content.map(b => b.text || '').join('');
    res.json({ success: true, answer });

  } catch (err) {
    console.error('educate error:', err.message);
    res.status(500).json({ error: 'Failed — try again.' });
  }
});

module.exports = router;
