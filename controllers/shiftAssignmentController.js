const shiftAssignmentModel = require('../models/shiftAssignmentModel');

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await shiftAssignmentModel.getAllAssignments();
    res.json({ data: assignments });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { user_id, shift_id, start_date = null, end_date = null } = req.body;
    await shiftAssignmentModel.createAssignment({ user_id, shift_id, start_date, end_date });
    res.json({ success: true, message: 'شیفت با موفقیت تخصیص داده شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await shiftAssignmentModel.deleteAssignment(id);
    res.json({ success: true, message: 'تخصیص شیفت با موفقیت حذف شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 