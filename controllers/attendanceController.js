const attendanceModel = require('../models/attendanceModel');

exports.getAttendanceLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const { logs, total } = await attendanceModel.getAttendanceLogs(limit, offset);
    res.json({ data: logs, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 