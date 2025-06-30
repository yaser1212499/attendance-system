const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// گزارشات موجود
router.get('/daily', reportController.getDailyAttendance);
router.get('/monthly', reportController.getMonthlyAttendance);

// گزارشات جدید
router.get('/overview', reportController.getSystemOverview);
router.get('/late-absence', reportController.getLateAbsenceReport);
router.get('/overtime', reportController.getOvertimeReport);
router.get('/salary', reportController.getSalaryReport);
router.get('/leave', reportController.getLeaveReport);
router.get('/shift', reportController.getShiftReport);
router.get('/attendance-chart', reportController.getAttendanceChart);
router.get('/performance', reportController.getEmployeePerformance);
router.get('/smart-salary', reportController.getSmartSalaryReport);
router.get('/smart-notifications', reportController.getSmartNotifications);

module.exports = router; 