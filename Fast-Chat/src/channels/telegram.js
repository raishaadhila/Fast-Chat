const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const messageRouter = require('../router/messageRouter');
const logger = require('../utils/logger');

let bot = null;
function getBot() {
  if (!bot && config.telegram.botToken) {
    bot = new TelegramBot(config.telegram.botToken);
  }
  return bot;
}

async function handleTelegram(req, res) {
  const update = req.body;
  const message = update.message;

  if (!message?.text) return res.sendStatus(200);

  const incomingMessage = {
    channel: 'telegram',
    customerId: String(message.chat.id),
    customerName: [message.from.first_name, message.from.last_name].filter(Boolean).join(' '),
    text: message.text,
    messageId: String(message.message_id),
    timestamp: String(message.date),
  };

  await messageRouter.route(incomingMessage);
  res.sendStatus(200);
}

async function sendTelegramMessage(chatId, text) {
  await getBot().sendMessage(chatId, text);
  logger.info(`Telegram message sent to ${chatId}`);
}

module.exports = { handleTelegram, sendTelegramMessage };
