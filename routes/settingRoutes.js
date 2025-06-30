const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', settingController.getSettings);
router.post('/', settingController.createOrUpdateSetting);
router.delete('/:key', settingController.deleteSetting);
router.get('/all', settingController.getAllSettings);
router.put('/:key', settingController.updateSetting);

module.exports = router; 