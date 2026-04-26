const { getDatabase } = require('../profiles/firebase');

async function getEvents(fromDate, toDate) {
  const db = getDatabase();
  const snapshot = await db.ref('analytics/events').once('value');
  const raw = snapshot.val() || {};
  const events = Object.values(raw);

  return events.filter((e) => {
    const t = new Date(e.timestamp);
    return t >= fromDate && t <= toDate;
  });
}

async function getKPIs(fromDate, toDate) {
  const events = await getEvents(fromDate, toDate);
  const handled = events.filter((e) => e.event === 'message_handled');

  const totalConversations = handled.length;
  const avgResponseTimeMs = totalConversations
    ? Math.round(handled.reduce((sum, e) => sum + (e.responseTimeMs || 0), 0) / totalConversations)
    : 0;

  const byChannel = {};
  const byModel = {};

  for (const e of handled) {
    byChannel[e.channel] = (byChannel[e.channel] || 0) + 1;
    byModel[e.model] = (byModel[e.model] || 0) + 1;
  }

  return {
    totalConversations,
    avgResponseTimeMs,
    byChannel,
    byModel,
    period: { from: fromDate.toISOString(), to: toDate.toISOString() },
  };
}

module.exports = { getKPIs, getEvents };
