const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// مسیرهای خاص پروفایل باید قبل از مسیرهای پارامتری باشند
router.get('/profile/me', userController.getProfile); // دریافت پروفایل کاربر جاری
router.put('/profile/update', userController.updateProfile); // به‌روزرسانی پروفایل
router.get('/profile/:id', userController.getProfile); // دریافت پروفایل کاربر خاص

router.get('/', userController.getUsers);
router.post('/', userController.createOrUpdateUser);
router.get('/:id', userController.getUserById); // این باید آخر باشد

module.exports = router; 