const db = require('../config/db');

exports.getAllLeaves = async () => {
  const [rows] = await db.query(`
    SELECT l.*, u.name as user_name
    FROM leaves l
    JOIN users u ON l.user_id = u.user_id
    ORDER BY l.requested_at DESC
  `);
  return rows;
};

exports.createLeave = async ({ user_id, type, start_date, end_date, days, reason, hour_from = null, hour_to = null }) => {
  await db.query(
    'INSERT INTO leaves (user_id, type, start_date, end_date, days, reason, hour_from, hour_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, type, start_date, end_date, days, reason, hour_from, hour_to]
  );
};

exports.reviewLeave = async (id, status, manager_comment) => {
  await db.query(
    'UPDATE leaves SET status = ?, manager_comment = ?, reviewed_at = NOW() WHERE id = ?',
    [status, manager_comment, id]
  );
};

exports.deleteLeave = async (id) => {
  await db.query('DELETE FROM leaves WHERE id = ?', [id]);
}; 