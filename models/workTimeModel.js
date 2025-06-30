const db = require('../config/db');

exports.createOrUpdateWorkTime = async ({ user_id, date, overtime_hours = 0, undertime_hours = 0, type = 'manual' }) => {
  await db.query(
    `INSERT INTO work_times (user_id, date, overtime_hours, undertime_hours, type) VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE overtime_hours = VALUES(overtime_hours), undertime_hours = VALUES(undertime_hours), type = VALUES(type)`,
    [user_id, date, overtime_hours, undertime_hours, type]
  );
};

// تابع ساده برای محاسبه خودکار از حضور و غیاب
exports.calculateFromAttendance = async (user_id, date) => {
  try {
    // دریافت تمام ثبت‌های حضور و غیاب کاربر در تاریخ مشخص
    const [attendances] = await db.query(`
      SELECT timestamp, type
      FROM attendances 
      WHERE user_id = ? AND DATE(timestamp) = ?
      ORDER BY timestamp
    `, [user_id, date]);

    if (attendances.length === 0) {
      return { overtime: 0, undertime: 0 };
    }

    // محاسبه ساده ساعات کار
    let actualWorkHours = 0;
    let lastCheckIn = null;
    
    for (const record of attendances) {
      if (record.type === 'ورود') {
        lastCheckIn = new Date(record.timestamp);
      } else if (record.type === 'خروج' && lastCheckIn) {
        const checkOut = new Date(record.timestamp);
        const workTime = (checkOut - lastCheckIn) / (1000 * 60 * 60); // ساعت
        actualWorkHours += workTime;
        lastCheckIn = null;
      }
    }

    // فرض ساده: 8 ساعت کار روزانه
    const expectedHours = 8;
    const overtime = Math.max(0, actualWorkHours - expectedHours);
    const undertime = Math.max(0, expectedHours - actualWorkHours);

    return { overtime, undertime };
  } catch (error) {
    console.error('Error calculating from attendance:', error);
    return { overtime: 0, undertime: 0 };
  }
};

exports.getUserWorkTimes = async (user_id, month, year) => {
  const [rows] = await db.query(
    `SELECT * FROM work_times WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? ORDER BY date`,
    [user_id, month, year]
  );
  return rows;
};

exports.getAllWorkTimes = async (month, year) => {
  const [rows] = await db.query(
    `SELECT w.*, u.name as user_name FROM work_times w JOIN users u ON w.user_id = u.user_id WHERE MONTH(w.date) = ? AND YEAR(w.date) = ? ORDER BY w.date DESC`,
    [month, year]
  );
  return rows;
};

// تابع جدید برای دریافت داده‌های اضافه کاری
exports.getOvertimeData = async (start_date, end_date, user_id = null) => {
  try {
    let query = `
      SELECT 
        u.user_id,
        u.name,
        u.department,
        a.date,
        a.entry_time,
        a.exit_time,
        a.work_hours,
        COALESCE(w.overtime_hours, 0) as overtime_hours,
        COALESCE(w.undertime_hours, 0) as undertime_hours,
        COALESCE(w.overtime_hours, 0) * 150 as overtime_pay,
        w.type,
        w.notes
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          DATE(timestamp) as date,
          MIN(CASE WHEN type = 'ورود' THEN TIME(timestamp) END) as entry_time,
          MAX(CASE WHEN type = 'خروج' THEN TIME(timestamp) END) as exit_time,
          SUM(CASE WHEN type = 'خروج' THEN 
            TIMESTAMPDIFF(MINUTE, 
              (SELECT MAX(timestamp) FROM attendances a2 
               WHERE a2.user_id = attendances.user_id 
               AND a2.type = 'ورود' 
               AND DATE(a2.timestamp) = DATE(attendances.timestamp)
               AND a2.timestamp < attendances.timestamp), 
              timestamp
            ) / 60.0
          ELSE 0 END) as work_hours
        FROM attendances 
        WHERE DATE(timestamp) BETWEEN ? AND ?
        GROUP BY user_id, DATE(timestamp)
      ) a ON u.user_id = a.user_id
      LEFT JOIN work_times w ON u.user_id = w.user_id AND a.date = w.date
      WHERE a.date IS NOT NULL
    `;
    
    const params = [start_date, end_date];
    
    if (user_id) {
      query += ' AND u.user_id = ?';
      params.push(user_id);
    }
    
    query += ' ORDER BY a.date DESC, u.name';
    
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error getting overtime data:', error);
    throw error;
  }
};

// تابع جدید برای محاسبه اضافه کاری در یک بازه زمانی
exports.calculateOvertimeForPeriod = async (start_date, end_date) => {
  try {
    let totalProcessed = 0;
    let totalOvertime = 0;

    // دریافت تمام کاربران
    const [users] = await db.query('SELECT user_id FROM users WHERE status = "فعال"');
    
    for (const user of users) {
      // محاسبه برای هر روز در بازه زمانی
      const currentDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // بررسی آیا حضور و غیاب برای این روز وجود دارد
        const [attendances] = await db.query(`
          SELECT COUNT(*) as count FROM attendances 
          WHERE user_id = ? AND DATE(timestamp) = ?
        `, [user.user_id, dateStr]);
        
        if (attendances[0].count > 0) {
          // محاسبه اضافه کاری از حضور و غیاب
          const { overtime, undertime } = await this.calculateFromAttendance(user.user_id, dateStr);
          
          // ذخیره یا به‌روزرسانی در جدول work_times
          await this.createOrUpdateWorkTime({
            user_id: user.user_id,
            date: dateStr,
            overtime_hours: overtime,
            undertime_hours: undertime,
            type: 'auto'
          });
          
          totalOvertime += overtime;
          totalProcessed++;
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return { totalProcessed, totalOvertime };
  } catch (error) {
    console.error('Error calculating overtime for period:', error);
    throw error;
  }
}; 