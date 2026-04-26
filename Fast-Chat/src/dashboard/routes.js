const express = require('express');
const router = express.Router();
const { getKPIs } = require('../analytics/aggregator');
const customerService = require('../profiles/customerService');

router.get('/summary', async (req, res, next) => {
  try {
    const to = new Date();
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [kpis, profiles] = await Promise.all([
      getKPIs(from, to),
      customerService.list(),
    ]);
    res.json({
      kpis,
      totalCustomers: profiles.length,
    });
  } catch (err) { next(err); }
});

module.exports = router;
