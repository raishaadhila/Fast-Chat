<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=36&pause=1000&color=5B6EF5&center=true&vCenter=true&width=600&lines=Fast-Chat+%F0%9F%92%AC;AI-Powered+CRM+Automation" alt="Fast-Chat" />

**Automate customer conversations across WhatsApp, Telegram & Instagram — powered by Claude & GPT-4o.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FF6F00?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-5B6EF5?style=for-the-badge)](https://anthropic.com)
[![Deploy](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

[View Prototype](#-prototype) · [Quick Start](#-quick-start) · [API Reference](#-api-reference) · [Deploy](#-deploy-to-railway)

</div>

---

## 📌 Overview

**Fast-Chat** is an omnichannel AI CRM that brings all your customer conversations into **one smart inbox** and automatically responds using AI — matched to your brand voice.

Built for small businesses that want 24/7 customer support without hiring more staff.

```
Customer sends a message on WhatsApp / Telegram / Instagram
                        ↓
            Fast-Chat receives via webhook
                        ↓
         AI reads customer profile + history
                        ↓
        Claude or GPT-4o generates a reply
      (in your brand's tone, within 1-2 seconds)
                        ↓
          Reply is sent back automatically ✅
```

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🗂️ | **Unified Inbox** | All WhatsApp, Telegram & Instagram messages in one dashboard |
| 🤖 | **AI Auto-Reply** | Claude or GPT-4o responds automatically in under 2 seconds |
| 🎨 | **Brand Voice** | Customize AI tone per business — formal, friendly, casual |
| 👥 | **Customer Profiles** | Auto-built profiles with history, tags, notes & purchase data |
| 📊 | **Analytics** | Response times, sentiment scores, channel & AI breakdown |
| 🔗 | **Webhooks** | Sync purchase data from Shopify or any e-commerce platform |
| 🔒 | **Escalation** | AI hands off to a human agent when it's uncertain |

---

## 🗂️ Project Structure

```
Fast-Chat/
│
├── 📄 prototype.html              # Clickable UI demo — open in browser, no setup needed
├── 📄 PRD.md                      # Product vision, features & goals
├── 📄 requirements.md             # Functional & non-functional requirements
├── 📄 tasks.md                    # Implementation task checklist
│
├── src/
│   ├── server.js                  # Express server + rate limiting
│   ├── config/index.js            # All environment variables
│   ├── utils/logger.js            # Winston structured logger
│   │
│   ├── webhooks/                  # Incoming message endpoints
│   │   └── index.js               # Routes: /webhook/whatsapp, /telegram, /instagram
│   │
│   ├── channels/                  # Channel integrations
│   │   ├── whatsapp.js            # WhatsApp Business API
│   │   ├── telegram.js            # Telegram Bot API
│   │   └── instagram.js           # Instagram Graph API
│   │
│   ├── router/
│   │   └── messageRouter.js       # Dispatches messages → AI model → reply
│   │
│   ├── ai/                        # AI response engine
│   │   ├── openaiClient.js        # GPT-4o client (complex queries)
│   │   ├── anthropicClient.js     # Claude client (general queries)
│   │   ├── prompts.js             # Templates: greeting, FAQ, sales, support
│   │   ├── contextManager.js      # Keeps last 10 messages as context
│   │   ├── toneCustomizer.js      # Builds system prompt from brand tone
│   │   └── fallback.js            # Escalates to human when AI is uncertain
│   │
│   ├── profiles/                  # Customer profile management
│   │   ├── firebase.js            # Firebase Admin SDK
│   │   ├── schema.js              # Database schema reference
│   │   ├── customerService.js     # Create, read, update, delete, search
│   │   ├── enrichment.js          # Inbound webhook for purchase data
│   │   └── routes.js              # REST API: /api/profiles
│   │
│   ├── analytics/                 # Reporting
│   │   ├── events.js              # Log events to Firebase
│   │   ├── aggregator.js          # Compute KPIs from raw events
│   │   ├── export.js              # Generate CSV downloads
│   │   └── routes.js              # REST API: /api/analytics
│   │
│   └── dashboard/
│       └── routes.js              # REST API: /api/dashboard/summary
│
├── .env.example                   # All required environment variables
├── railway.json                   # Railway one-click deploy config
└── package.json
```

---

## 🚀 Quick Start

### 1 — Clone & Install

```bash
git clone https://github.com/raishaadhila/Fast-Chat.git
cd Fast-Chat
npm install
```

### 2 — Set Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
# Server
PORT=3000

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# WhatsApp Business API
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=any-secret-you-choose

# Telegram
TELEGRAM_BOT_TOKEN=...

# Instagram
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_VERIFY_TOKEN=any-secret-you-choose

# Firebase
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### 3 — Run

```bash
npm run dev     # development (auto-reload)
npm start       # production
```

Server starts at `http://localhost:3000`

---

## 🖥️ Prototype

> Open **`prototype.html`** in any browser — no server or API keys needed.

Demonstrates the full product UI:

- **Inbox** — live conversations, AI typing indicator, send messages, toggle AI on/off
- **Customer Panel** — profile, tags, notes, purchase history, tone override
- **Analytics** — KPI cards, conversation volume chart, channel & AI breakdown
- **Settings** — connect channels, configure AI model, set brand tone & system prompt

---

## 📡 API Reference

### Webhooks — Receive Messages

```
GET  /webhook/whatsapp      Webhook verification (Meta)
POST /webhook/whatsapp      Incoming WhatsApp messages

POST /webhook/telegram      Incoming Telegram messages

GET  /webhook/instagram     Webhook verification (Meta)
POST /webhook/instagram     Incoming Instagram messages
```

### Customer Profiles

```
GET    /api/profiles                     List all profiles
                                         Query: ?tag=VIP&channel=wa&name=Aisyah
GET    /api/profiles/:customerId         Get one profile
PATCH  /api/profiles/:customerId         Update notes, tags, tone, preferences
DELETE /api/profiles/:customerId         Delete profile (GDPR compliance)
POST   /api/profiles/enrich/webhook      Receive purchase data from e-commerce
```

### Analytics

```
GET  /api/analytics/kpis      KPIs for a date range
                               Query: ?from=2025-01-01&to=2025-01-31
GET  /api/analytics/export    Download conversation data as CSV
```

### Dashboard

```
GET  /api/dashboard/summary   7-day overview: KPIs + total customers
GET  /health                  Health check
```

---

## 🤖 AI Routing Logic

Fast-Chat picks the AI model based on the incoming channel:

| Channel | Model | Reason |
|---|---|---|
| WhatsApp | OpenAI GPT-4o | Higher query complexity, product & sales questions |
| Telegram | Anthropic Claude | General support, fast conversational replies |
| Instagram | Anthropic Claude | Short-form, casual tone matches platform style |

**Fallback:** If the AI reply contains uncertainty phrases ("I don't know", "I can't help"), the conversation is automatically escalated to a human agent with a log entry.

---

## 🔥 Firebase Schema

```
/profiles/{customerId}
  ├── customerId        string
  ├── customerName      string
  ├── channel           "whatsapp" | "telegram" | "instagram"
  ├── contactDetails    { phone, username }
  ├── preferences       object
  ├── tags              string[]
  ├── notes             string
  ├── purchaseHistory   object[]
  ├── businessTone      "friendly" | "formal" | "casual" | "professional"
  ├── createdAt         ISO string
  └── lastSeen          unix timestamp

/context/{customerId}
  └── [ { role: "user" | "assistant", content: string } ]  ← max 10 entries

/analytics/events/{pushId}
  ├── event             string
  ├── channel           string
  ├── customerId        string
  ├── model             "openai" | "anthropic"
  ├── responseTimeMs    number
  └── timestamp         ISO string
```

---

## 🚢 Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select `raishaadhila/Fast-Chat`
4. Add all environment variables from `.env.example` in the Railway dashboard
5. Done — Railway auto-detects Node.js and deploys using `railway.json`

> **Estimated cost:** Under $5/month for the first 50 workspaces on Railway's Starter plan.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| AI — General | Anthropic Claude (`claude-sonnet-4-6`) |
| AI — Complex | OpenAI GPT-4o |
| Database | Firebase Realtime Database |
| Channels | WhatsApp Business API · Telegram Bot API · Instagram Graph API |
| Logging | Winston |
| Deployment | Railway |

---

## 🎯 Goals

- 🏆 10 paying customers within 3 months of launch
- ⭐ 90% customer satisfaction within 6 months
- ⚡ Average AI response time under 2 seconds

---

## 📄 Documentation

| File | Description |
|---|---|
| [`PRD.md`](./PRD.md) | Product vision, key features & business goals |
| [`requirements.md`](./requirements.md) | Functional & non-functional requirements |
| [`tasks.md`](./tasks.md) | Full implementation task checklist |

---

## 🤝 Contributing

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/your-feature

# 3. Commit
git commit -m "feat: add your feature"

# 4. Push & open a PR
git push origin feature/your-feature
```

---

<div align="center">


`raishaalfadhilaputri@gmail.com`

</div>
