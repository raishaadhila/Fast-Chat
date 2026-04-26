const axios = require('axios');
const config = require('../config');
const messageRouter = require('../router/messageRouter');
const logger = require('../utils/logger');

const GRAPH_URL = 'https://graph.facebook.com/v19.0';

function verifyWhatsApp(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
}

async function handleWhatsApp(req, res) {
  const body = req.body;

  if (body.object !== 'whatsapp_business_account') return res.sendStatus(404);

  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const incomingMessage = {
    channel: 'whatsapp',
    customerId: message.from,
    customerName: value.contacts?.[0]?.profile?.name || message.from,
    text: message.text?.body || '',
    messageId: message.id,
    timestamp: message.timestamp,
  };

  await messageRouter.route(incomingMessage);
  res.sendStatus(200);
}

async function sendWhatsAppMessage(to, text) {
  await axios.post(
    `${GRAPH_URL}/${config.whatsapp.phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    },
    {
      headers: { Authorization: `Bearer ${config.whatsapp.token}` },
    }
  );
  logger.info(`WhatsApp message sent to ${to}`);
}

module.exports = { verifyWhatsApp, handleWhatsApp, sendWhatsAppMessage };
