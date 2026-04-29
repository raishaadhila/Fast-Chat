const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('../src/utils/logger');
const webhookRoutes = require('../src/webhooks');
const dashboardRoutes = require('../src/dashboard/routes');
const profileRoutes = require('../src/profiles/routes');
const analyticsRoutes = require('../src/analytics/routes');
const businessRoutes = require('../src/business/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use('/webhook', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/business', businessRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', platform: 'vercel' }));

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
