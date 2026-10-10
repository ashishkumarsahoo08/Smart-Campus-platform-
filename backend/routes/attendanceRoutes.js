const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/summary/:studentId', attendanceController.getStudentSummary);
router.get('/defaulters', attendanceController.getDefaulters);
router.get('/sessions', attendanceController.getSessions);
router.post('/session', attendanceController.recordSession);

module.exports = router;
