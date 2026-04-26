const axios = require('axios');
const config = require('../config');
const messageRouter = require('../router/messageRouter');
const logger = require('../utils/logger');

const GRAPH_URL = 'https://graph.facebook.com/v19.0';

function verifyInstagram(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.instagram.verifyToken) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
}

async function handleInstagram(req, res) {
  const body = req.body;

  if (body.object !== 'instagram') return res.sendStatus(404);

  const entry = body.entry?.[0];
  const messaging = entry?.messaging?.[0];

  if (!messaging?.message?.text) return res.sendStatus(200);

  const incomingMessage = {
    channel: 'instagram',
    customerId: messaging.sender.id,
    customerName: messaging.sender.id,
    text: messaging.message.text,
    messageId: messaging.message.mid,
    timestamp: String(messaging.timestamp),
  };

  await messageRouter.route(incomingMessage);
  res.sendStatus(200);
}

async function sendInstagramMessage(recipientId, text) {
  await axios.post(
    `${GRAPH_URL}/me/messages`,
    {
      recipient: { id: recipientId },
      message: { text },
    },
    {
      params: { access_token: config.instagram.accessToken },
    }
  );
  logger.info(`Instagram message sent to ${recipientId}`);
}

module.exports = { verifyInstagram, handleInstagram, sendInstagramMessage };
