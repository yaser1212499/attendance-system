const salaryModel = require('../models/salaryModel');
const ExcelJS = require('exceljs');
const db = require('../config/db');

// محاسبه حقوق کاربر
exports.calculateSalary = async (req, res) => {
  try {
    const { user_id, month, year } = req.body;
    
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'تمام فیلدها الزامی است' });
    }
    
    const result = await salaryModel.calculateSalary({ user_id, month, year });
    res.json({ success: true, data: result });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// محاسبه حقوق همه کاربران
exports.calculateAllSalaries = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'ماه و سال الزامی است' });
    }
    
    // دریافت همه کاربران با حقوق پایه
    const [users] = await db.query('SELECT user_id, name FROM users WHERE salary > 0');
    
    const results = [];
    const errors = [];
    
    for (const user of users) {
      try {
        const result = await salaryModel.calculateSalary({ 
          user_id: user.user_id, 
          month, 
          year 
        });
        results.push(result);
      } catch (error) {
        errors.push(`${user.name}: ${error.message}`);
      }
    }
    
    res.json({ 
      success: true, 
      data: results, 
      errors,
      total: results.length,
      errors_count: errors.length
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// دریافت لیست حقوق
exports.getSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'ماه و سال الزامی است' });
    }
    
    const salaries = await salaryModel.getSalaries(month, year);
    res.json({ success: true, data: salaries });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// خروجی اکسل
exports.exportToExcel = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'ماه و سال الزامی است' });
    }
    
    const salaries = await salaryModel.getSalaries(month, year);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('حقوق و دستمزد');
    
    // تنظیم ستون‌ها
    worksheet.columns = [
      { header: 'نام', key: 'name', width: 20 },
      { header: 'دپارتمان', key: 'department', width: 15 },
      { header: 'حقوق پایه', key: 'base_salary', width: 15 },
      { header: 'ساعات اضافه‌کاری', key: 'total_overtime_hours', width: 15 },
      { header: 'ساعات کم‌کاری', key: 'total_undertime_hours', width: 15 },
      { header: 'حق اضافه‌کاری', key: 'overtime_pay', width: 15 },
      { header: 'کسور کم‌کاری', key: 'undertime_deduction', width: 15 },
      { header: 'حقوق نهایی', key: 'total_salary', width: 15 },
      { header: 'روزهای کاری', key: 'work_days', width: 15 }
    ];
    
    // اضافه کردن داده‌ها
    salaries.forEach(salary => {
      worksheet.addRow({
        name: salary.name,
        department: salary.department,
        base_salary: salary.base_salary,
        total_overtime_hours: salary.total_overtime_hours,
        total_undertime_hours: salary.total_undertime_hours,
        overtime_pay: salary.overtime_pay,
        undertime_deduction: salary.undertime_deduction,
        total_salary: salary.total_salary,
        work_days: salary.work_days
      });
    });
    
    // تنظیم هدر
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=salaries-${year}-${month}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.paySalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_date = null, status = 'paid', bonus = 0, deductions = 0, tax = 0 } = req.body;
    await salaryModel.paySalary({ id, payment_date, status, bonus, deductions, tax });
    res.json({ success: true, message: 'وضعیت پرداخت حقوق به‌روزرسانی شد.' });
  } catch (e) {
    console.error('Error paying salary:', e);
    res.status(500).json({ error: e.message });
  }
};

// تابع جدید: تست سیستم
exports.testSalarySystem = async (req, res) => {
  try {
    const db = require('../config/db');
    
    // بررسی تعداد کاربران
    const [[usersCount]] = await db.query('SELECT COUNT(*) as count FROM users WHERE salary > 0');
    
    // بررسی تعداد حقوق ثبت شده
    const [[salariesCount]] = await db.query('SELECT COUNT(*) as count FROM salaries');
    
    // بررسی تعداد ساعات کار
    const [[workTimesCount]] = await db.query('SELECT COUNT(*) as count FROM attendances');
    
    // بررسی تنظیمات سیستم
    const [settings] = await db.query(`
      SELECT setting_key, setting_value 
      FROM settings 
      WHERE setting_key IN ('coef_overtime', 'coef_undertime', 'coef_tax', 'coef_bonus', 'monthly_work_hours')
    `);
    
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json({
      success: true,
      data: {
        users_count: usersCount.count,
        salaries_count: salariesCount.count,
        work_times_count: workTimesCount.count,
        settings: settingsObj
      }
    });
  } catch (e) {
    console.error('Error testing salary system:', e);
    res.status(500).json({ error: e.message });
  }
};

// تابع جدید: گزارش هوشمند حقوق
exports.getSmartSalaryReport = async (req, res) => {
  try {
    const { user_id, month, year } = req.query;
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'user_id، month و year الزامی است.' });
    }

    // دریافت اطلاعات حقوق
    const [salaryData] = await db.query(`
      SELECT 
        s.*,
        u.name,
        u.department
      FROM salaries s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.user_id = ? AND s.month = ? AND s.year = ?
      LIMIT 1
    `, [user_id, month, year]);

    if (salaryData.length === 0) {
      return res.status(404).json({ error: 'اطلاعات حقوق یافت نشد.' });
    }

    const salary = salaryData[0];

    // دریافت جزئیات روزانه
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyDetails = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // بررسی مرخصی
      const [leaves] = await db.query(`
        SELECT type, hour_from, hour_to, days, reason
        FROM leaves 
        WHERE user_id = ? 
          AND start_date <= ? 
          AND end_date >= ? 
          AND status = 'approved'
      `, [user_id, date, date]);

      // بررسی اضافه‌کاری و کم‌کاری دستی
      const [workTimes] = await db.query(`
        SELECT overtime_hours, undertime_hours, type
        FROM work_times 
        WHERE user_id = ? AND date = ?
        LIMIT 1
      `, [user_id, date]);

      // بررسی حضور و غیاب
      const [attendances] = await db.query(`
        SELECT timestamp, type
        FROM attendances 
        WHERE user_id = ? AND DATE(timestamp) = ?
        ORDER BY timestamp
      `, [user_id, date]);

      dailyDetails.push({
        date,
        day_of_week: new Date(date).toLocaleDateString('fa-IR', { weekday: 'long' }),
        leaves: leaves,
        work_times: workTimes[0] || null,
        attendances: attendances,
        is_holiday: false // می‌توانید از جدول تعطیلات بررسی کنید
      });
    }

    // محاسبه آمار کلی
    const stats = {
      total_days: daysInMonth,
      work_days: salary.work_days || 0,
      leave_days: salary.leave_days || 0,
      holiday_days: salary.holiday_days || 0,
      total_overtime_hours: salary.total_overtime_hours || 0,
      total_undertime_hours: salary.total_undertime_hours || 0,
      overtime_pay: salary.overtime_pay || 0,
      undertime_deduction: salary.undertime_deduction || 0
    };

    res.json({
      success: true,
      data: {
        user_info: {
          user_id: salary.user_id,
          name: salary.name,
          department: salary.department
        },
        salary_info: {
          base_salary: salary.base_salary,
          total_salary: salary.total_salary,
          status: salary.status,
          payment_date: salary.payment_date
        },
        stats: stats,
        daily_details: dailyDetails
      }
    });

  } catch (e) {
    console.error('Error getting smart salary report:', e);
    res.status(500).json({ error: e.message });
  }
}; 