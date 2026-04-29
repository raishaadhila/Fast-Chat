const geminiClient = require('../ai/geminiClient');
const openaiClient = require('../ai/openaiClient');
const anthropicClient = require('../ai/anthropicClient');
const contextManager = require('../ai/contextManager');
const toneCustomizer = require('../ai/toneCustomizer');
const fallback = require('../ai/fallback');
const customerService = require('../profiles/customerService');
const analyticsEvents = require('../analytics/events');
const businessSkills = require('../ai/businessSkills');
const config = require('../config');
const logger = require('../utils/logger');

function getSender(channel) {
  const senders = {
    whatsapp: () => require('../channels/whatsapp').sendWhatsAppMessage,
    telegram: () => require('../channels/telegram').sendTelegramMessage,
    instagram: () => require('../channels/instagram').sendInstagramMessage,
  };
  return senders[channel]?.();
}

// Pick AI provider: Gemini if key exists (free), else OpenAI or Anthropic
function pickModel() {
  if (config.gemini.apiKey) return 'gemini';
  if (config.openai.apiKey) return 'openai';
  if (config.anthropic.apiKey) return 'anthropic';
  throw new Error('No AI provider configured. Set GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.');
}

async function generateReply({ model, systemPrompt, history, userMessage }) {
  if (model === 'openai') return openaiClient.generateReply({ systemPrompt, history, userMessage });
  if (model === 'anthropic') return anthropicClient.generateReply({ systemPrompt, history, userMessage });
  return geminiClient.generateReply({ systemPrompt, history, userMessage });
}

async function route(incomingMessage) {
  const { channel, customerId, customerName, text, timestamp } = incomingMessage;
  const startTime = Date.now();

  try {
    await customerService.upsert({ customerId, customerName, channel, lastSeen: timestamp });

    const profile = await customerService.get(customerId);
    const history = await contextManager.getHistory(customerId);

    // Build system prompt: base tone + business skills (FAQ, rules, persona)
    const systemPrompt = toneCustomizer.buildSystemPrompt(
      profile?.businessTone,
      businessSkills.getSystemInstruction()
    );

    const model = pickModel();
    const reply = await generateReply({ model, systemPrompt, history, userMessage: text });

    if (!reply || fallback.isUncertain(reply)) {
      await fallback.escalateToAgent({ incomingMessage, reply });
      return;
    }

    await contextManager.appendMessage(customerId, { role: 'user', content: text });
    await contextManager.appendMessage(customerId, { role: 'assistant', content: reply });

    const send = getSender(channel);
    if (send) await send(customerId, reply);

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
