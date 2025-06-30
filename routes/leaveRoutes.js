const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', leaveController.getLeaves);
router.post('/', leaveController.createLeave);
router.put('/:id/review', leaveController.reviewLeave);
router.delete('/:id', leaveController.deleteLeave);

module.exports = router; 