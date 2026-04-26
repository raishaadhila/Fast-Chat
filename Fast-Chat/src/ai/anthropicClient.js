const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

async function generateReply({ systemPrompt, history, userMessage }) {
  const messages = [
    ...history,
    { role: 'user', content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: systemPrompt,
    messages,
  });

  return response.content[0]?.text?.trim() || null;
}

module.exports = { generateReply };
