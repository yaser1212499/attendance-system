const db = require('../config/db');

exports.getPermissionForUserAndDate = async (user_id, date) => {
  const [[row]] = await db.query(
    'SELECT * FROM overtime_permissions WHERE user_id = ? AND date = ?',
    [user_id, date]
  );
  return row;
};

exports.getPermissionsForUser = async (user_id) => {
  const [rows] = await db.query(
    'SELECT * FROM overtime_permissions WHERE user_id = ? ORDER BY date DESC',
    [user_id]
  );
  return rows;
};

exports.createPermission = async ({ user_id, date, start_time, end_time, approved_by }) => {
  await db.query(
    'INSERT INTO overtime_permissions (user_id, date, start_time, end_time, approved_by) VALUES (?, ?, ?, ?, ?)',
    [user_id, date, start_time, end_time, approved_by]
  );
}; 