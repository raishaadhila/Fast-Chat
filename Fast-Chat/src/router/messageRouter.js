const openaiClient = require('../ai/openaiClient');
const anthropicClient = require('../ai/anthropicClient');
const contextManager = require('../ai/contextManager');
const toneCustomizer = require('../ai/toneCustomizer');
const fallback = require('../ai/fallback');
const customerService = require('../profiles/customerService');
const analyticsEvents = require('../analytics/events');
const logger = require('../utils/logger');

function getSender(channel) {
  const senders = {
    whatsapp: () => require('../channels/whatsapp').sendWhatsAppMessage,
    telegram: () => require('../channels/telegram').sendTelegramMessage,
    instagram: () => require('../channels/instagram').sendInstagramMessage,
  };
  return senders[channel]?.();
}

// Assign AI model per channel: complex queries → OpenAI, general → Anthropic
const CHANNEL_MODEL = {
  whatsapp: 'openai',
  telegram: 'anthropic',
  instagram: 'anthropic',
};

async function route(incomingMessage) {
  const { channel, customerId, customerName, text, timestamp } = incomingMessage;
  const startTime = Date.now();

  try {
    await customerService.upsert({ customerId, customerName, channel, lastSeen: timestamp });

    const profile = await customerService.get(customerId);
    const history = await contextManager.getHistory(customerId);
    const systemPrompt = toneCustomizer.buildSystemPrompt(profile?.businessTone);

    const model = CHANNEL_MODEL[channel] || 'anthropic';
    let reply;

    if (model === 'openai') {
      reply = await openaiClient.generateReply({ systemPrompt, history, userMessage: text });
    } else {
      reply = await anthropicClient.generateReply({ systemPrompt, history, userMessage: text });
    }

    if (!reply || fallback.isUncertain(reply)) {
      await fallback.escalateToAgent({ incomingMessage, reply });
      return;
    }

    await contextManager.appendMessage(customerId, { role: 'user', content: text });
    await contextManager.appendMessage(customerId, { role: 'assistant', content: reply });

    const send = getSender(channel);
    await send(customerId, reply);

    await analyticsEvents.log({
      event: 'message_handled',
      channel,
      customerId,
      model,
      responseTimeMs: Date.now() - startTime,
    });
  } catch (err) {
    logger.error('messageRouter error', { err: err.message, channel, customerId });
    await fallback.escalateToAgent({ incomingMessage, error: err.message });
  }
}

module.exports = { route };
