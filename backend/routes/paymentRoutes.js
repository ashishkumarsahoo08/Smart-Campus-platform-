const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// 1. Webhook Endpoint (The Push System):
// POST /api/payment/webhook
router.post('/webhook', paymentController.handleWebhook);

// 2. Status Enquiry Fallback (The Pull System / Polling):
// GET /api/payment/status/:orderId
router.get('/status/:orderId', paymentController.getOrderStatus);

// Quick Simulation Helper
// POST /api/payment/simulate
router.post('/simulate', paymentController.handleWebhook);

module.exports = router;
