const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institutionController');

router.get('/', institutionController.getAllInstitutions);
router.get('/subscription-qrs', institutionController.getSubscriptionQrs);
router.get('/subscription-qr/:planId', institutionController.getSubscriptionQrByPlan);
router.post('/create-payment-order', institutionController.createPaymentOrder);
router.get('/payment-order/:orderId', institutionController.getPaymentOrderStatus);
router.post('/confirm-payment-order', institutionController.confirmPaymentOrder);
router.get('/supabase-status', institutionController.getSupabaseStatus);
router.post('/supabase-sync', institutionController.syncSupabase);
router.post('/supabase-config', institutionController.configSupabase);
router.post('/register-subscription', institutionController.registerSubscription);
router.get('/subscription-plans', institutionController.getSubscriptionPlans);
router.put('/subscription-plans', institutionController.updateSubscriptionPlans);
router.post('/subscription-plans', institutionController.updateSubscriptionPlans);
router.get('/:id', institutionController.getInstitutionById);
router.post('/', institutionController.onboardInstitution);
router.patch('/:id/subscription', institutionController.updateSubscription);
router.patch('/:id/payment-config', institutionController.updatePaymentConfig);
router.patch('/:id/receipt-template', institutionController.updateReceiptTemplate);
router.get('/:id/receipt-preview', institutionController.getReceiptPreview);

module.exports = router;

