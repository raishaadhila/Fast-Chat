/*
  Firebase Realtime Database schema for customer profiles:

  /profiles/{customerId}
    customerId: string
    customerName: string
    channel: 'whatsapp' | 'telegram' | 'instagram'
    contactDetails:
      phone: string | null
      username: string | null
    preferences: object        — freeform key/value set by agents
    tags: string[]             — labels e.g. ['vip', 'pending-refund']
    notes: string              — agent-added notes
    purchaseHistory: object[]  — enriched from external e-commerce
    businessTone: string       — tone override for this customer
    createdAt: string (ISO)
    lastSeen: string (unix timestamp)

  /context/{customerId}
    Array of { role: 'user'|'assistant', content: string }
    Capped at 10 entries by contextManager

  /analytics/events/{pushId}
    event: string
    channel: string
    customerId: string
    model: string
    responseTimeMs: number
    timestamp: string (ISO)
*/

module.exports = {};
