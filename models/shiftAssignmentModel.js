const db = require('../config/db');

exports.getAllAssignments = async () => {
  const [rows] = await db.query(`
    SELECT sa.*, u.name as user_name, s.name as shift_name, s.start_time, s.end_time, s.color
    FROM shift_assignments sa
    JOIN users u ON sa.user_id = u.user_id
    JOIN shifts s ON sa.shift_id = s.id
    WHERE sa.is_active = TRUE
    ORDER BY sa.assigned_at DESC
  `);
  return rows;
};

exports.createAssignment = async ({ user_id, shift_id, start_date = null, end_date = null }) => {
  // Remove existing assignment for this user
  await db.query('UPDATE shift_assignments SET is_active = FALSE WHERE user_id = ?', [user_id]);
  // Add new assignment
  await db.query(
    'INSERT INTO shift_assignments (user_id, shift_id, start_date, end_date) VALUES (?, ?, ?, ?)',
    [user_id, shift_id, start_date, end_date]
  );
};

exports.deleteAssignment = async (id) => {
  await db.query('UPDATE shift_assignments SET is_active = FALSE WHERE id = ?', [id]);
}; 