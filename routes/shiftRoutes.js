const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', shiftController.getShifts);
router.post('/', shiftController.createShift);
router.delete('/:id', shiftController.deleteShift);

module.exports = router; 