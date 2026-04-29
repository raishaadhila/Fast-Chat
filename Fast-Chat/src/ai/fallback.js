const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { shouldHandoff } = require('./businessSkills');

const UNCERTAIN_PHRASES = [
  "i don't know", "i'm not sure", "i cannot", "i can't help",
  "please contact", "reach out to", "tidak tahu", "tidak bisa",
  "hubungi admin", "tanyakan ke admin",
];

function isUncertain(reply) {
  const lower = reply.toLowerCase();
  return UNCERTAIN_PHRASES.some((phrase) => lower.includes(phrase));
}

function needsHandoff(customerText, aiReply) {
  return shouldHandoff(customerText) || isUncertain(aiReply || '');
}

async function escalateToAgent({ incomingMessage, reply, error }) {
  const reason = error
    ? `⚠️ Error: ${error}`
    : `🤔 AI tidak yakin atau pelanggan minta bantuan manusia`;

  logger.warn('Escalating to human agent', {
    channel: incomingMessage.channel,
    customerId: incomingMessage.customerId,
    reason,
  });

  // Notify via Telegram bot if ALERT_TELEGRAM_CHAT_ID is set
  if (config.telegram.botToken && config.alertChatId) {
    try {
      const msg = [
        `🔔 *Eskalasi ke Admin*`,
        `Channel: ${incomingMessage.channel}`,
        `Customer: ${incomingMessage.customerName} (${incomingMessage.customerId})`,
        `Pesan: "${incomingMessage.text}"`,
        `Alasan: ${reason}`,
      ].join('\n');

      await axios.post(
        `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
        { chat_id: config.alertChatId, text: msg, parse_mode: 'Markdown' }
      );
    } catch (err) {
      logger.error('Failed to send escalation alert', { err: err.message });
    }
  }
}

module.exports = { isUncertain, needsHandoff, escalateToAgent };
