const { getDatabase } = require('./firebase');

async function upsert({ customerId, customerName, channel, lastSeen }) {
  const db = getDatabase();
  const ref = db.ref(`profiles/${customerId}`);
  const snapshot = await ref.once('value');
  const existing = snapshot.val();

  if (!existing) {
    await ref.set({
      customerId,
      customerName,
      channel,
      contactDetails: { phone: null, username: null },
      preferences: {},
      tags: [],
      notes: '',
      purchaseHistory: [],
      businessTone: 'friendly',
      createdAt: new Date().toISOString(),
      lastSeen,
    });
  } else {
    await ref.update({ lastSeen, customerName });
  }
}

async function get(customerId) {
  const db = getDatabase();
  const snapshot = await db.ref(`profiles/${customerId}`).once('value');
  return snapshot.val();
}

async function update(customerId, updates) {
  const db = getDatabase();
  await db.ref(`profiles/${customerId}`).update(updates);
}

async function remove(customerId) {
  const db = getDatabase();
  await db.ref(`profiles/${customerId}`).remove();
}

async function list() {
  const db = getDatabase();
  const snapshot = await db.ref('profiles').once('value');
  const data = snapshot.val() || {};
  return Object.values(data);
}

async function search({ tag, channel, name }) {
  const all = await list();
  return all.filter((p) => {
    if (tag && !p.tags?.includes(tag)) return false;
    if (channel && p.channel !== channel) return false;
    if (name && !p.customerName?.toLowerCase().includes(name.toLowerCase())) return false;
    return true;
  });
}

module.exports = { upsert, get, update, remove, list, search };
