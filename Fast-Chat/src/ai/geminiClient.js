const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

let _client = null;
function getClient() {
  if (!_client) _client = new GoogleGenerativeAI(config.gemini.apiKey);
  return _client;
}

async function generateReply({ systemPrompt, history, userMessage }) {
  const model = getClient().getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  // Convert history to Gemini format
  const geminiHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(userMessage);
  return result.response.text()?.trim() || null;
}

module.exports = { generateReply };
