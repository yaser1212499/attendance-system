const db = require('../config/db');

exports.getAttendanceLogs = async (limit = 10, offset = 0) => {
  const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM attendances');
  const [logs] = await db.query(
    `SELECT user_id AS deviceUserId, timestamp AS recordTime, type, device_id FROM attendances ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return { logs, total };
};

exports.getAttendanceByUserAndTime = async (userId, timestamp) => {
  const [rows] = await db.query('SELECT id FROM attendances WHERE user_id = ? AND timestamp = ?', [userId, timestamp]);
  return rows;
};

exports.getLastAttendanceType = async (userId) => {
  const [rows] = await db.query('SELECT type FROM attendances WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1', [userId]);
  return rows.length > 0 ? rows[0].type : 'خروج';
};

exports.insertAttendance = async ({ userId, timestamp, type, deviceId }) => {
  await db.query(
    'INSERT INTO attendances (user_id, timestamp, type, device_id) VALUES (?, ?, ?, ?)',
    [userId, timestamp, type, deviceId]
  );
}; 