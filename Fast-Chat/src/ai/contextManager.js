const { getDatabase } = require('../profiles/firebase');

const MAX_HISTORY = 10; // messages kept in context window

async function getHistory(customerId) {
  const db = getDatabase();
  const snapshot = await db.ref(`context/${customerId}`).once('value');
  return snapshot.val() || [];
}

async function appendMessage(customerId, message) {
  const db = getDatabase();
  const ref = db.ref(`context/${customerId}`);
  const snapshot = await ref.once('value');
  const history = snapshot.val() || [];

  history.push(message);

  const trimmed = history.slice(-MAX_HISTORY);
  await ref.set(trimmed);
}

async function clearHistory(customerId) {
  const db = getDatabase();
  await db.ref(`context/${customerId}`).remove();
}

module.exports = { getHistory, appendMessage, clearHistory };
