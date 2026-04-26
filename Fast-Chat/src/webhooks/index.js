const express = require('express');
const router = express.Router();
const { handleWhatsApp, verifyWhatsApp } = require('../channels/whatsapp');
const { handleTelegram } = require('../channels/telegram');
const { handleInstagram, verifyInstagram } = require('../channels/instagram');

// WhatsApp webhook verification
router.get('/whatsapp', verifyWhatsApp);
router.post('/whatsapp', handleWhatsApp);

// Telegram webhook
router.post('/telegram', handleTelegram);

// Instagram webhook verification
router.get('/instagram', verifyInstagram);
router.post('/instagram', handleInstagram);

module.exports = router;
