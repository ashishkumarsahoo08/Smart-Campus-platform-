const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.chat);
router.get('/voice-logs', aiController.getVoiceLogs);
router.get('/config', aiController.getConfig);

module.exports = router;
