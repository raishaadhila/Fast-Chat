const { getDatabase } = require('../profiles/firebase');
const logger = require('../utils/logger');

async function log(eventData) {
  try {
    const db = getDatabase();
    await db.ref('analytics/events').push({
      ...eventData,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error('Failed to log analytics event', { err: err.message });
  }
}

module.exports = { log };
