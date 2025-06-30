const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const authMiddleware = require('../middleware/authMiddleware');

// محاسبه حقوق کاربر
router.post('/calculate', authMiddleware, salaryController.calculateSalary);

// محاسبه حقوق همه کاربران
router.post('/calculate-all', authMiddleware, salaryController.calculateAllSalaries);

// دریافت لیست حقوق
router.get('/list', authMiddleware, salaryController.getSalaries);

// خروجی اکسل
router.get('/export', authMiddleware, salaryController.exportToExcel);

module.exports = router; 