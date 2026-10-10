const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

router.get('/student/:studentId', feeController.getStudentFees);
router.post('/pay', feeController.processPayment);
router.get('/receipt/:receiptNo', feeController.getReceipt);
router.get('/overview', feeController.getOverview);
router.post('/reminder', feeController.sendFeeReminder);

module.exports = router;
