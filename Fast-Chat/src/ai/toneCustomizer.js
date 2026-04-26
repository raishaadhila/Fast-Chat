const TONE_GUIDES = {
  formal: 'Use professional, formal language. Avoid contractions and slang. Be precise and courteous.',
  friendly: 'Use warm, approachable language. Feel free to use contractions. Be helpful and encouraging.',
  casual: 'Use relaxed, conversational language. Keep it short and natural. Match the customer energy.',
  professional: 'Be clear, concise, and solution-oriented. Use industry-appropriate language without being stiff.',
};

const BASE_PROMPT = `You are an AI customer support assistant. Your job is to help customers quickly and accurately.`;

function buildSystemPrompt(tone = 'friendly', customInstruction = '') {
  const toneGuide = TONE_GUIDES[tone] || TONE_GUIDES.friendly;
  const parts = [BASE_PROMPT, toneGuide];

  if (customInstruction) parts.push(customInstruction);

  return parts.join('\n\n');
}

module.exports = { buildSystemPrompt, TONE_GUIDES };
