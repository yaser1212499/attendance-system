const workTimeModel = require('../models/workTimeModel');
const attendanceModel = require('../models/attendanceModel');
const db = require('../config/db');

exports.createOrUpdateWorkTime = async (req, res) => {
  try {
    const { user_id, date, overtime_hours = 0, undertime_hours = 0, type = 'manual' } = req.body;
    if (!user_id || !date) {
      return res.status(400).json({ error: 'user_id و date الزامی است.' });
    }
    await workTimeModel.createOrUpdateWorkTime({ user_id, date, overtime_hours, undertime_hours, type });
    res.json({ success: true, message: 'ساعات اضافه‌کاری/کم‌کاری ثبت شد.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getUserWorkTimes = async (req, res) => {
  try {
    const { user_id, month, year } = req.query;
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'user_id، month و year الزامی است.' });
    }
    const rows = await workTimeModel.getUserWorkTimes(user_id, month, year);
    res.json({ data: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllWorkTimes = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }
    const rows = await workTimeModel.getAllWorkTimes(month, year);
    res.json({ data: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// API جدید برای دریافت داده‌های اضافه کاری
exports.getOvertimeData = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date و end_date الزامی است.' });
    }

    const data = await workTimeModel.getOvertimeData(start_date, end_date, user_id);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// API جدید برای محاسبه اضافه کاری
exports.calculateOvertime = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date و end_date الزامی است.' });
    }

    const result = await workTimeModel.calculateOvertimeForPeriod(start_date, end_date);
    res.json({ 
      success: true, 
      message: 'محاسبه اضافه کاری با موفقیت انجام شد',
      totalProcessed: result.totalProcessed,
      totalOvertime: result.totalOvertime
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// API جدید برای ثبت دستی اضافه کاری
exports.manualOvertimeEntry = async (req, res) => {
  try {
    const { user_id, date, overtime_hours, undertime_hours } = req.body;
    
    if (!user_id || !date) {
      return res.status(400).json({ error: 'user_id و date الزامی است.' });
    }

    await workTimeModel.createOrUpdateWorkTime({ 
      user_id, 
      date, 
      overtime_hours: overtime_hours || 0, 
      undertime_hours: undertime_hours || 0, 
      type: 'manual'
    });

    res.json({ success: true, message: 'اضافه کاری با موفقیت ثبت شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// تابع ثبت اضافه‌کاری دستی
exports.addManualOvertime = async (req, res) => {
  try {
    let { user_id, date, overtime_hours } = req.body;
    
    // تبدیل user_id به حروف بزرگ برای تطبیق با دیتابیس
    user_id = user_id.toUpperCase();
    
    if (!user_id || !date || overtime_hours === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'user_id، date و overtime_hours الزامی است.' 
      });
    }

    // بررسی وجود کاربر
    const [[user]] = await db.query('SELECT name FROM users WHERE user_id = ?', [user_id]);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'کاربر یافت نشد.' 
      });
    }

    // بررسی معتبر بودن تاریخ
    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        error: 'تاریخ نامعتبر است.' 
      });
    }

    // بررسی معتبر بودن ساعات اضافه‌کاری
    const hours = parseFloat(overtime_hours);
    if (isNaN(hours) || hours < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'ساعات اضافه‌کاری باید عدد مثبت باشد.' 
      });
    }

    // بررسی وجود رکورد قبلی
    const [existing] = await db.query(
      'SELECT id FROM work_times WHERE user_id = ? AND date = ?',
      [user_id, date]
    );

    if (existing.length > 0) {
      // به‌روزرسانی رکورد موجود
      await db.query(
        'UPDATE work_times SET overtime_hours = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND date = ?',
        [hours, user_id, date]
      );
    } else {
      // ایجاد رکورد جدید
      await db.query(
        'INSERT INTO work_times (user_id, date, overtime_hours, type) VALUES (?, ?, ?, "manual")',
        [user_id, date, hours]
      );
    }

    res.json({ 
      success: true, 
      message: 'اضافه‌کاری با موفقیت ثبت شد.',
      data: {
        user_id,
        user_name: user.name,
        date,
        overtime_hours: hours
      }
    });

  } catch (error) {
    console.error('Error adding manual overtime:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در ثبت اضافه‌کاری: ' + error.message 
    });
  }
};

// تابع دریافت اضافه‌کاری کاربر
exports.getUserOvertime = async (req, res) => {
  try {
    const { user_id, month, year } = req.query;
    
    if (!user_id || !month || !year) {
      return res.status(400).json({ 
        success: false, 
        error: 'user_id، month و year الزامی است.' 
      });
    }

    const [rows] = await db.query(`
      SELECT 
        wt.id,
        wt.user_id,
        wt.date,
        wt.overtime_hours,
        wt.undertime_hours,
        wt.type,
        wt.created_at,
        u.name as user_name
      FROM work_times wt
      JOIN users u ON wt.user_id = u.user_id
      WHERE wt.user_id = ? 
        AND MONTH(wt.date) = ? 
        AND YEAR(wt.date) = ?
      ORDER BY wt.date DESC
    `, [user_id, month, year]);

    res.json({ 
      success: true, 
      data: rows 
    });

  } catch (error) {
    console.error('Error getting user overtime:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت اضافه‌کاری: ' + error.message 
    });
  }
}; 