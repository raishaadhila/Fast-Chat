const { getEvents } = require('./aggregator');

function toCSV(events) {
  if (!events.length) return '';
  const headers = Object.keys(events[0]).join(',');
  const rows = events.map((e) =>
    Object.values(e)
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [headers, ...rows].join('\n');
}

async function exportCSV(fromDate, toDate) {
  const events = await getEvents(fromDate, toDate);
  return toCSV(events);
}

module.exports = { exportCSV };
