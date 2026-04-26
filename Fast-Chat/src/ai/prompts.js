const INTENT_TEMPLATES = {
  greeting: `Greet the customer warmly, introduce yourself as an AI assistant, and ask how you can help them today.`,

  faq: `Answer the customer's question clearly and concisely using the information in your knowledge base. If you don't know the answer, say so honestly and offer to connect them with a human agent.`,

  sales: `Help the customer explore products or services. Highlight relevant features and benefits. Be helpful, not pushy. If they want to purchase, guide them on how to proceed.`,

  support: `Help the customer resolve their issue step by step. Be empathetic and patient. If the issue cannot be resolved automatically, escalate to a human agent with a summary of the problem.`,

  default: `Respond helpfully and concisely to the customer's message. Stay on topic and maintain the brand voice.`,
};

function getTemplate(intent = 'default') {
  return INTENT_TEMPLATES[intent] || INTENT_TEMPLATES.default;
}

module.exports = { getTemplate, INTENT_TEMPLATES };
