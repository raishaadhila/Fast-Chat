const express = require('express');
const router = express.Router();
const customerService = require('./customerService');
const { handleExternalWebhook } = require('./enrichment');

router.get('/', async (req, res, next) => {
  try {
    const { tag, channel, name } = req.query;
    const profiles = tag || channel || name
      ? await customerService.search({ tag, channel, name })
      : await customerService.list();
    res.json(profiles);
  } catch (err) { next(err); }
});

router.get('/:customerId', async (req, res, next) => {
  try {
    const profile = await customerService.get(req.params.customerId);
    if (!profile) return res.status(404).json({ error: 'Not found' });
    res.json(profile);
  } catch (err) { next(err); }
});

router.patch('/:customerId', async (req, res, next) => {
  try {
    const allowed = ['notes', 'tags', 'preferences', 'businessTone'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );
    await customerService.update(req.params.customerId, updates);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.delete('/:customerId', async (req, res, next) => {
  try {
    await customerService.remove(req.params.customerId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.post('/enrich/webhook', express.raw({ type: '*/*' }), handleExternalWebhook);

module.exports = router;
