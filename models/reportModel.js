const db = require('../config/db');

exports.getDailyReport = async (date) => {
  const [rows] = await db.query(`
    SELECT 
      u.user_id,
      u.name,
      u.department,
      MIN(CASE WHEN a.type = 'ورود' THEN a.timestamp END) as check_in,
      MAX(CASE WHEN a.type = 'خروج' THEN a.timestamp END) as check_out,
      COUNT(CASE WHEN a.type = 'ورود' THEN 1 END) as check_in_count,
      COUNT(CASE WHEN a.type = 'خروج' THEN 1 END) as check_out_count
    FROM users u
    LEFT JOIN attendances a ON u.user_id = a.user_id 
      AND DATE(a.timestamp) = ?
    GROUP BY u.user_id, u.name, u.department
    ORDER BY u.name
  `, [date]);
  return rows;
};

exports.getWeeklyReport = async (startDate) => {
  const [rows] = await db.query(`
    SELECT 
      DATE(timestamp) as date,
      COUNT(DISTINCT user_id) as present_count,
      COUNT(CASE WHEN type = 'ورود' THEN 1 END) as check_ins,
      COUNT(CASE WHEN type = 'خروج' THEN 1 END) as check_outs
    FROM attendances 
    WHERE DATE(timestamp) BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
    GROUP BY DATE(timestamp)
    ORDER BY date
  `, [startDate, startDate]);
  return rows;
};

exports.getMonthlyReport = async (year, month) => {
  const [rows] = await db.query(`
    SELECT 
      DATE(timestamp) as date,
      COUNT(DISTINCT user_id) as present_count,
      COUNT(CASE WHEN type = 'ورود' THEN 1 END) as check_ins,
      COUNT(CASE WHEN type = 'خروج' THEN 1 END) as check_outs
    FROM attendances 
    WHERE YEAR(timestamp) = ? AND MONTH(timestamp) = ?
    GROUP BY DATE(timestamp)
    ORDER BY date
  `, [year, month]);
  return rows;
};

exports.getLateReport = async (date) => {
  const [rows] = await db.query(`
    SELECT 
      u.user_id,
      u.name,
      u.department,
      a.timestamp as check_in_time,
      TIME(a.timestamp) as check_in_hour,
      TIMESTAMPDIFF(MINUTE, CONCAT(DATE(a.timestamp), ' 08:00:00'), a.timestamp) as minutes_late
    FROM users u
    INNER JOIN attendances a ON u.user_id = a.user_id 
    WHERE DATE(a.timestamp) = ? 
      AND a.type = 'ورود'
      AND TIME(a.timestamp) > '08:00:00'
    ORDER BY a.timestamp
  `, [date]);
  return rows;
}; 