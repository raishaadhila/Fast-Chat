const OpenAI = require('openai');
const config = require('../config');

let _client = null;
function getClient() {
  if (!_client) _client = new OpenAI({ apiKey: config.openai.apiKey });
  return _client;
}

async function generateReply({ systemPrompt, history, userMessage }) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 512,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || null;
}

module.exports = { generateReply };
