const logger = require('../utils/logger');

const UNCERTAIN_PHRASES = [
  "i don't know",
  "i'm not sure",
  "i cannot",
  "i can't help",
  "please contact",
  "reach out to",
];

function isUncertain(reply) {
  const lower = reply.toLowerCase();
  return UNCERTAIN_PHRASES.some((phrase) => lower.includes(phrase));
}

async function escalateToAgent({ incomingMessage, reply, error }) {
  const reason = error ? `Error: ${error}` : `AI uncertain: "${reply}"`;
  logger.warn('Escalating to human agent', {
    channel: incomingMessage.channel,
    customerId: incomingMessage.customerId,
    reason,
  });

  // TODO: Notify agent via in-app notification, email, or Slack webhook
  // Example: await notifyAgentSlack({ incomingMessage, reason });
}

module.exports = { isUncertain, escalateToAgent };
