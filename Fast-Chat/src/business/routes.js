const express = require('express');
const router = express.Router();
const { getDatabase } = require('../profiles/firebase');
const { DEFAULT_PERSONA, DEFAULT_FAQ, DEFAULT_RULES } = require('../ai/businessSkills');

// GET current business config
router.get('/config', async (req, res, next) => {
  try {
    const db = getDatabase();
    const snapshot = await db.ref('business/config').once('value');
    const config = snapshot.val() || {
      persona: DEFAULT_PERSONA,
      faq: DEFAULT_FAQ,
      rules: DEFAULT_RULES,
      tone: 'friendly',
      businessName: '',
      industry: '',
      operatingHours: 'Mon-Sat 08:00-21:00',
    };
    res.json(config);
  } catch (err) { next(err); }
});

// PATCH update business config
router.patch('/config', async (req, res, next) => {
  try {
    const allowed = ['persona', 'faq', 'rules', 'tone', 'businessName', 'industry', 'operatingHours'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );
    const db = getDatabase();
    await db.ref('business/config').update(updates);
    res.json({ success: true, updated: Object.keys(updates) });
  } catch (err) { next(err); }
});

// GET FAQ entries
router.get('/faq', async (req, res, next) => {
  try {
    const db = getDatabase();
    const snapshot = await db.ref('business/faq').once('value');
    const faq = snapshot.val() || [];
    res.json(Array.isArray(faq) ? faq : Object.values(faq));
  } catch (err) { next(err); }
});

// POST add FAQ entry
router.post('/faq', async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });
    const db = getDatabase();
    await db.ref('business/faq').push({ question, answer, createdAt: new Date().toISOString() });
    res.status(201).json({ success: true });
  } catch (err) { next(err); }
});

// DELETE FAQ entry
router.delete('/faq/:id', async (req, res, next) => {
  try {
    const db = getDatabase();
    await db.ref(`business/faq/${req.params.id}`).remove();
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
