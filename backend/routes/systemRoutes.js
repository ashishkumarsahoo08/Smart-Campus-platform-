const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/history', systemController.getActivityHistory);
router.get('/sms-logs', systemController.getSmsLogs);
router.get('/network-info', systemController.getNetworkInfo);
router.get('/api-config', systemController.getApiConfigs);
router.post('/api-config', systemController.saveApiConfig);
router.post('/reset-clean', systemController.resetToCleanSlate);
router.post('/load-demo', systemController.loadDemoData);
router.get('/db-mode', systemController.getDatabaseMode);

module.exports = router;
