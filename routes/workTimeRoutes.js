const express = require('express');
const router = express.Router();
const workTimeController = require('../controllers/workTimeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', workTimeController.createOrUpdateWorkTime);
router.get('/', workTimeController.getUserWorkTimes);
router.get('/all', workTimeController.getAllWorkTimes);

// مسیرهای جدید برای اضافه کاری
router.get('/overtime', workTimeController.getOvertimeData);
router.post('/overtime/calculate', workTimeController.calculateOvertime);
router.post('/overtime/manual', workTimeController.addManualOvertime);
router.get('/user-overtime', workTimeController.getUserOvertime);

module.exports = router; 