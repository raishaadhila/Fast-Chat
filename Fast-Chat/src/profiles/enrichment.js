const crypto = require('crypto');
const config = require('../config');
const customerService = require('./customerService');
const logger = require('../utils/logger');

// Verifies HMAC signature from external webhooks (e.g. Shopify)
function verifySignature(rawBody, signature) {
  const expected = crypto
    .createHmac('sha256', config.externalWebhookSecret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

async function handleExternalWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];
  const rawBody = JSON.stringify(req.body);

  if (!verifySignature(rawBody, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { customerId, orderData } = req.body;

  if (!customerId || !orderData) {
    return res.status(400).json({ error: 'Missing customerId or orderData' });
  }

  const profile = await customerService.get(customerId);
  if (!profile) return res.status(404).json({ error: 'Customer not found' });

  const purchaseHistory = [...(profile.purchaseHistory || []), orderData];
  await customerService.update(customerId, { purchaseHistory });

  logger.info(`Enriched profile ${customerId} with purchase data`);
  res.status(200).json({ success: true });
}

module.exports = { handleExternalWebhook };
