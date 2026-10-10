const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

router.post('/translate', translationController.translate);
router.get('/languages', translationController.getLanguages);
router.get('/dictionary', translationController.getDictionary);

module.exports = router;
