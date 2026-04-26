const express = require('express');
const router = express.Router();
const { getKPIs } = require('./aggregator');
const { exportCSV } = require('./export');

function parseDateRange(req) {
  const to = req.query.to ? new Date(req.query.to) : new Date();
  const from = req.query.from
    ? new Date(req.query.from)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

router.get('/kpis', async (req, res, next) => {
  try {
    const { from, to } = parseDateRange(req);
    const kpis = await getKPIs(from, to);
    res.json(kpis);
  } catch (err) { next(err); }
});

router.get('/export', async (req, res, next) => {
  try {
    const { from, to } = parseDateRange(req);
    const csv = await exportCSV(from, to);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="fast-chat-analytics.csv"');
    res.send(csv);
  } catch (err) { next(err); }
});

module.exports = router;
