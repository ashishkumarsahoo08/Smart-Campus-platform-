const express = require('express');
const router = express.Router();
const gatePassController = require('../controllers/gatePassController');

// All passes combined
router.get('/', gatePassController.getAllPasses);

// Normal Outpasses (Short Duration - Market / Medical / Errand)
router.get('/outpasses', gatePassController.getOutpasses);
router.post('/outpass', gatePassController.applyOutpass);
router.patch('/outpass/:id/approve', gatePassController.approveOutpass);

// Long Leave Passes (1+ Days - Multi-Tier Workflow)
router.get('/leaves', gatePassController.getLeaves);
router.post('/leave', gatePassController.applyLeave);
router.patch('/leave/:id/verify', gatePassController.verifyLeave);

// Main Gate Security Scanner (Dual Scan: EXIT & ENTRY)
router.post('/scan', gatePassController.scanPass);
router.get('/movements', gatePassController.getMovements);

// Legacy compatibility
router.post('/', gatePassController.applyPass);
router.patch('/:id', gatePassController.updatePassDecision);

module.exports = router;
