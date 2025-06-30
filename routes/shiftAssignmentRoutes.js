const express = require('express');
const router = express.Router();
const shiftAssignmentController = require('../controllers/shiftAssignmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', shiftAssignmentController.getAssignments);
router.post('/', shiftAssignmentController.createAssignment);
router.delete('/:id', shiftAssignmentController.deleteAssignment);

module.exports = router; 