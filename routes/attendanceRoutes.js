const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', attendanceController.getAttendanceLogs);

module.exports = router; 