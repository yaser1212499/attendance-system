const shiftModel = require('../models/shiftModel');

// Helper function
function calculateWorkHours(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.abs(diffHours);
}

exports.getShifts = async (req, res) => {
  try {
    const shifts = await shiftModel.getAllShifts();
    res.json({ data: shifts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createShift = async (req, res) => {
  try {
    const { name, start_time, end_time, color } = req.body;
    const work_hours = calculateWorkHours(start_time, end_time);
    await shiftModel.createShift({ name, start_time, end_time, color, work_hours });
    res.json({ success: true, message: 'شیفت با موفقیت ایجاد شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    await shiftModel.deleteShift(id);
    res.json({ success: true, message: 'شیفت با موفقیت حذف شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 