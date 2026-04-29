require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  whatsapp: {
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },

  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    verifyToken: process.env.INSTAGRAM_VERIFY_TOKEN,
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },

  externalWebhookSecret: process.env.EXTERNAL_WEBHOOK_SECRET,
  alertChatId: process.env.ALERT_TELEGRAM_CHAT_ID,
};
