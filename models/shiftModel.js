const db = require('../config/db');

exports.getAllShifts = async () => {
  const [rows] = await db.query('SELECT * FROM shifts WHERE is_active = TRUE ORDER BY name');
  return rows;
};

exports.createShift = async ({ name, start_time, end_time, color, work_hours }) => {
  await db.query(
    'INSERT INTO shifts (name, start_time, end_time, color, work_hours) VALUES (?, ?, ?, ?, ?)',
    [name, start_time, end_time, color || '#007bff', work_hours]
  );
};

exports.deleteShift = async (id) => {
  await db.query('UPDATE shifts SET is_active = FALSE WHERE id = ?', [id]);
}; 