# 💬 Fast-Chat — AI-Powered CRM Automation

> Empower small businesses to automate customer relationship management using AI — without technical skills or expensive software.

![Fast-Chat Preview](https://img.shields.io/badge/status-prototype-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-orange) ![Deploy](https://img.shields.io/badge/Deploy-Railway-purple)

---

## 🎯 What is Fast-Chat?

Fast-Chat is an **omnichannel AI CRM** that brings all your customer conversations from WhatsApp, Telegram, and Instagram into one smart inbox — and automatically responds using Claude (Anthropic) or GPT-4o (OpenAI), matched to your brand voice.

### Key Features

| Feature | Description |
|---|---|
| 🗂️ **Unified Inbox** | All WhatsApp, Telegram & Instagram messages in one place |
| 🤖 **AI Auto-Reply** | Claude or GPT-4o responds to customers in under 2 seconds |
| 🎨 **Brand Tone** | Customize AI voice per business (formal, friendly, casual) |
| 👥 **Customer Profiles** | Auto-built profiles with history, tags, notes & purchases |
| 📊 **Analytics Dashboard** | Response times, sentiment, channel breakdown, AI vs human |
| 🔗 **Webhooks** | Integrate external e-commerce data into customer profiles |

---

## 🏗️ Project Structure

```
Fast-Chat/
├── src/
│   ├── server.js                  # Express entry point
│   ├── config/index.js            # Environment configuration
│   ├── utils/logger.js            # Winston logger
│   │
│   ├── webhooks/index.js          # Unified webhook router
│   ├── channels/
│   │   ├── whatsapp.js            # WhatsApp Business API
│   │   ├── telegram.js            # Telegram Bot API
│   │   └── instagram.js           # Instagram Graph API
│   │
│   ├── router/messageRouter.js    # Dispatches messages to AI
│   │
│   ├── ai/
│   │   ├── openaiClient.js        # OpenAI GPT-4o client
│   │   ├── anthropicClient.js     # Anthropic Claude client
│   │   ├── prompts.js             # Intent-based prompt templates
│   │   ├── contextManager.js      # Conversation history (Firebase)
│   │   ├── toneCustomizer.js      # Brand voice system
│   │   └── fallback.js            # Human agent escalation
│   │
│   ├── profiles/
│   │   ├── firebase.js            # Firebase Admin SDK init
│   │   ├── schema.js              # Database schema docs
│   │   ├── customerService.js     # CRUD for customer profiles
│   │   ├── enrichment.js          # External CRM/e-commerce webhook
│   │   └── routes.js              # Profile REST API
│   │
│   ├── analytics/
│   │   ├── events.js              # Event logging to Firebase
│   │   ├── aggregator.js          # KPI aggregation
│   │   ├── export.js              # CSV export
│   │   └── routes.js              # Analytics REST API
│   │
│   └── dashboard/routes.js        # Dashboard summary API
│
├── prototype.html                 # Clickable UI prototype (no server needed)
├── PRD.md                         # Product Requirements Document
├── requirements.md                # Functional & non-functional requirements
├── tasks.md                       # Implementation task checklist
├── railway.json                   # Railway deployment config
├── .env.example                   # Required environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Realtime Database enabled)
- API keys: OpenAI, Anthropic, WhatsApp Business, Telegram, Instagram

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/raishaadhila/Fast-Chat.git
cd Fast-Chat

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your API keys in .env

# 4. Run in development
npm run dev

# 5. Run in production
npm start
```

### Environment Variables

```env
# Server
PORT=3000

# AI Models
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...

# WhatsApp Business API
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=...

# Telegram
TELEGRAM_BOT_TOKEN=...

# Instagram / Facebook Graph API
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_VERIFY_TOKEN=...

# Firebase
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_DATABASE_URL=...
```

---

## 📡 API Endpoints

### Webhooks (incoming messages)
```
GET  /webhook/whatsapp     # Verification
POST /webhook/whatsapp     # Incoming WhatsApp messages
POST /webhook/telegram     # Incoming Telegram messages
GET  /webhook/instagram    # Verification
POST /webhook/instagram    # Incoming Instagram messages
```

### Customer Profiles
```
GET    /api/profiles                  # List all profiles (supports ?tag=&channel=&name=)
GET    /api/profiles/:customerId      # Get single profile
PATCH  /api/profiles/:customerId      # Update notes, tags, tone
DELETE /api/profiles/:customerId      # Delete profile (GDPR)
POST   /api/profiles/enrich/webhook   # Receive purchase data from e-commerce
```

### Analytics
```
GET /api/analytics/kpis     # KPIs for date range (?from=&to=)
GET /api/analytics/export   # Download CSV export
```

### Dashboard
```
GET /api/dashboard/summary  # 7-day overview (KPIs + total customers)
```

---

## 🤖 How the AI Works

```
Customer Message (WhatsApp / Telegram / Instagram)
        ↓
  Webhook Endpoint
        ↓
  Message Router
        ↓
  ┌─────────────────────────┐
  │  Load customer profile  │  ← Firebase
  │  Load conversation ctx  │  ← last 10 messages
  │  Apply brand tone       │  ← business config
  └─────────────────────────┘
        ↓
  AI Model (Claude or GPT-4o)
        ↓
  Is AI uncertain?
    YES → Escalate to human agent (log + notify)
    NO  → Send reply back via same channel
        ↓
  Log analytics event → Firebase
```

**Channel → Model routing:**
- WhatsApp → OpenAI GPT-4o (complex queries)
- Telegram → Anthropic Claude (general queries)
- Instagram → Anthropic Claude (general queries)

---

## 🧪 Preview Prototype

Open `prototype.html` in any browser — no server, no API keys needed.

Demonstrates the full UI: Inbox, Customer Profiles, Analytics Dashboard, and Settings.

---

## 🚢 Deploy to Railway

1. Push this repo to GitHub
2. Create a new project at [railway.app](https://railway.app)
3. Connect your GitHub repo
4. Add all environment variables from `.env.example`
5. Railway auto-detects Node.js and deploys via `railway.json`

---

## 📋 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| AI Models | Anthropic Claude, OpenAI GPT-4o |
| Database | Firebase Realtime Database |
| Channels | WhatsApp Business API, Telegram Bot API, Instagram Graph API |
| Logging | Winston |
| Deploy | Railway |

---

## 📄 Docs

- [PRD.md](./PRD.md) — Vision, features, target users, goals
- [requirements.md](./requirements.md) — Functional & non-functional requirements
- [tasks.md](./tasks.md) — Implementation task checklist

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Open a pull request

---

## 📬 Contact

Built by [Raisha](https://github.com/raishaadhila) · raishaalfadhilaputri@gmail.com
