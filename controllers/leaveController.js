const leaveModel = require('../models/leaveModel');

function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await leaveModel.getAllLeaves();
    res.json({ data: leaves });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createLeave = async (req, res) => {
  try {
    const { user_id, type, start_date, end_date, reason, hour_from = null, hour_to = null } = req.body;
    const days = calculateDays(start_date, end_date);
    await leaveModel.createLeave({ user_id, type, start_date, end_date, days, reason, hour_from, hour_to });
    res.json({ success: true, message: 'درخواست مرخصی با موفقیت ثبت شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.reviewLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, manager_comment } = req.body;
    await leaveModel.reviewLeave(id, status, manager_comment);
    res.json({ success: true, message: 'درخواست مرخصی بررسی شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    await leaveModel.deleteLeave(id);
    res.json({ success: true, message: 'درخواست مرخصی با موفقیت حذف شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 