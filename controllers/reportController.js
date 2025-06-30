const db = require('../config/db');
const userModel = require('../models/userModel');
const leaveModel = require('../models/leaveModel');
const settingModel = require('../models/settingModel');
const shiftAssignmentModel = require('../models/shiftAssignmentModel');
const shiftModel = require('../models/shiftModel');
const overtimePermissionsModel = require('../models/overtimePermissionsModel');
const salaryModel = require('../models/salaryModel');

// گزارش کلی سیستم
exports.getSystemOverview = async (req, res) => {
  try {
    // تعداد کل کاربران فعال
    const [users] = await db.query('SELECT COUNT(*) as total_users FROM users WHERE is_active = 1');
    
    // تعداد حضور امروز (کاربران منحصر به فرد)
    const [attendances] = await db.query('SELECT COUNT(DISTINCT user_id) as today_attendances FROM attendances WHERE DATE(timestamp) = CURDATE()');
    
    // تعداد مرخصی‌های در انتظار
    const [leaves] = await db.query('SELECT COUNT(*) as pending_leaves FROM leaves WHERE status = "pending"');
    
    // تعداد شیفت‌های فعال
    const [shifts] = await db.query('SELECT COUNT(*) as active_shifts FROM shifts WHERE is_active = 1');
    
    res.json({
      total_users: users[0].total_users,
      today_attendances: attendances[0].today_attendances,
      pending_leaves: leaves[0].pending_leaves,
      active_shifts: shifts[0].active_shifts
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش حضور و غیاب روزانه هوشمند
exports.getDailyAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const settings = await settingModel.getAllSettings();
    const users = await userModel.getAllUsers();
    const shifts = await shiftModel.getAllShifts();
    const shiftAssignments = await shiftAssignmentModel.getAllAssignments();

    // تعطیلات رسمی (از settings و calendar_events)
    let isHoliday = false;
    if (settings[`holiday_${targetDate}`]) isHoliday = true;
    // TODO: بررسی calendar_events نیز می‌تواند اضافه شود

    // دریافت مرخصی‌های تاییدشده برای این روز
    const [leaves] = await db.query(
      `SELECT user_id, type, status FROM leaves WHERE start_date <= ? AND end_date >= ? AND status = 'approved'`,
      [targetDate, targetDate]
    );
    const leaveMap = {};
    for (const l of leaves) leaveMap[l.user_id] = l;

    // گزارش نهایی
    const report = [];
    for (const user of users) {
      // شیفت کاربر
      const assignment = shiftAssignments.find(sa => sa.user_id === user.userId && sa.is_active);
      let shift = null;
      if (assignment) {
        shift = shifts.find(s => s.id === assignment.shift_id);
      }
      // ساعات کاری پیش‌فرض
      const shiftStart = shift ? shift.start_time : (settings.morningStart || '08:00');
      const shiftEnd = shift ? shift.end_time : (settings.afternoonEnd || '16:00');
      // محدوده مجاز تأخیر
      const delayStart = settings.delayStart || '08:15';
      const delayEnd = settings.delayEnd || '08:30';

      // ترددهای امروز
      const [attendances] = await db.query(
        `SELECT timestamp, type FROM attendances WHERE user_id = ? AND DATE(timestamp) = ? ORDER BY timestamp`,
        [user.userId, targetDate]
      );

      // جفت‌سازی ورود/خروج
      let pairs = [];
      let lastIn = null;
      for (const rec of attendances) {
        if (rec.type === 'ورود') {
          lastIn = rec.timestamp;
        } else if (rec.type === 'خروج' && lastIn) {
          pairs.push({ in: lastIn, out: rec.timestamp });
          lastIn = null;
        }
      }
      const incomplete = lastIn !== null || attendances.length % 2 !== 0;

      // محاسبه مجموع ساعت کاری
      let totalWorkMinutes = 0;
      for (const p of pairs) {
        const inTime = new Date(p.in);
        const outTime = new Date(p.out);
        totalWorkMinutes += (outTime - inTime) / (1000 * 60);
      }
      const totalWorkHours = totalWorkMinutes / 60;

      // وضعیت اولیه
      let status = 'absent';
      let delay = false, undertime = false, overtime = false, leave = false, holiday = false, incompleteDay = false;
      let firstIn = pairs.length > 0 ? new Date(pairs[0].in) : null;
      let lastOut = pairs.length > 0 ? new Date(pairs[pairs.length-1].out) : null;
      let delayMinutes = 0, undertimeMinutes = 0, overtimeMinutes = 0;

      // تعطیل رسمی
      if (isHoliday) {
        status = 'holiday';
        holiday = true;
      } else if (leaveMap[user.userId]) {
        // مرخصی تاییدشده
        status = 'leave';
        leave = true;
      } else if (attendances.length === 0) {
        // غیبت کامل
        status = 'absent';
      } else if (incomplete) {
        // تردد ناقص
        status = 'incomplete';
        incompleteDay = true;
      } else {
        // حاضر
        status = 'present';
        // بررسی تأخیر
        if (firstIn) {
          const shiftStartTime = new Date(targetDate + 'T' + shiftStart);
          const delayStartTime = new Date(targetDate + 'T' + delayStart);
          const delayEndTime = new Date(targetDate + 'T' + delayEnd);
          if (firstIn > shiftStartTime && firstIn <= delayStartTime) {
            // بدون تأخیر
          } else if (firstIn > delayStartTime && firstIn <= delayEndTime) {
            delay = true;
            delayMinutes = Math.round((firstIn - delayStartTime) / 60000);
            status = 'delay';
          } else if (firstIn > delayEndTime) {
            undertime = true;
            undertimeMinutes = Math.round((firstIn - delayEndTime) / 60000);
            status = 'undertime';
          }
        }
        // بررسی خروج زودتر
        if (lastOut) {
          const shiftEndTime = new Date(targetDate + 'T' + shiftEnd);
          if (lastOut < shiftEndTime) {
            undertime = true;
            undertimeMinutes += Math.round((shiftEndTime - lastOut) / 60000);
            status = 'undertime';
          }
        }
        // بررسی اضافه‌کاری با مجوز
        const overtimePermission = await overtimePermissionsModel.getPermissionForUserAndDate(user.userId, targetDate);
        if (overtimePermission && lastOut) {
          const overtimeStart = new Date(targetDate + 'T' + overtimePermission.start_time);
          const overtimeEnd = new Date(targetDate + 'T' + overtimePermission.end_time);
          if (lastOut > overtimeStart && lastOut <= overtimeEnd) {
            overtime = true;
            overtimeMinutes = Math.round((lastOut - overtimeStart) / 60000);
            status = 'overtime';
          }
        }
      }

      report.push({
        user_id: user.userId,
        name: user.name,
        department: user.department,
        shift: shift ? shift.name : null,
        date: targetDate,
        first_in: firstIn ? firstIn.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : null,
        last_out: lastOut ? lastOut.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : null,
        total_work_hours: totalWorkHours,
        delay,
        delay_minutes: delayMinutes,
        undertime,
        undertime_minutes: undertimeMinutes,
        overtime,
        overtime_minutes: overtimeMinutes,
        leave,
        holiday,
        incomplete: incompleteDay,
        status
      });
    }
    res.json({ data: report });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش حضور و غیاب ماهانه هوشمند
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const settings = await settingModel.getAllSettings();
    const users = await userModel.getAllUsers();
    const shifts = await shiftModel.getAllShifts();
    const shiftAssignments = await shiftAssignmentModel.getAllAssignments();

    // تعطیلات رسمی (از settings)
    const holidays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      if (settings[`holiday_${date}`]) holidays.push(date);
    }

    // دریافت مرخصی‌های تاییدشده برای این ماه
    const [leaves] = await db.query(
      `SELECT user_id, type, status, start_date, end_date FROM leaves WHERE (
        (YEAR(start_date) = ? AND MONTH(start_date) = ?) OR (YEAR(end_date) = ? AND MONTH(end_date) = ?)
      ) AND status = 'approved'`,
      [targetYear, targetMonth, targetYear, targetMonth]
    );
    // ساخت نقشه مرخصی برای هر روز هر کاربر
    const leaveMap = {};
    for (const l of leaves) {
      let cur = new Date(l.start_date);
      const end = new Date(l.end_date);
      while (cur <= end) {
        const dateStr = cur.toISOString().split('T')[0];
        leaveMap[`${l.user_id}_${dateStr}`] = l;
        cur.setDate(cur.getDate() + 1);
      }
    }

    // گزارش نهایی
    const report = [];
    for (const user of users) {
      // شیفت کاربر
      const assignment = shiftAssignments.find(sa => sa.user_id === user.userId && sa.is_active);
      let shift = null;
      if (assignment) {
        shift = shifts.find(s => s.id === assignment.shift_id);
      }
      // ساعات کاری پیش‌فرض
      const shiftStart = shift ? shift.start_time : (settings.morningStart || '08:00');
      const shiftEnd = shift ? shift.end_time : (settings.afternoonEnd || '16:00');
      const delayStart = settings.delayStart || '08:15';
      const delayEnd = settings.delayEnd || '08:30';

      // آمار ماهانه
      let totalWorkMinutes = 0, totalOvertimeMinutes = 0, totalUndertimeMinutes = 0, totalDelayCount = 0, totalUndertimeCount = 0, totalOvertimeCount = 0, totalIncomplete = 0, totalAbsent = 0, totalLeave = 0, totalHoliday = 0;
      const dailyDetails = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const date = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        const isHoliday = holidays.includes(date);
        const leave = leaveMap[`${user.userId}_${date}`];
        // ترددهای امروز
        const [attendances] = await db.query(
          `SELECT timestamp, type FROM attendances WHERE user_id = ? AND DATE(timestamp) = ? ORDER BY timestamp`,
          [user.userId, date]
        );
        // جفت‌سازی ورود/خروج
        let pairs = [];
        let lastIn = null;
        for (const rec of attendances) {
          if (rec.type === 'ورود') {
            lastIn = rec.timestamp;
          } else if (rec.type === 'خروج' && lastIn) {
            pairs.push({ in: lastIn, out: rec.timestamp });
            lastIn = null;
          }
        }
        const incomplete = lastIn !== null || attendances.length % 2 !== 0;
        // محاسبه مجموع ساعت کاری
        let workMinutes = 0;
        for (const p of pairs) {
          const inTime = new Date(p.in);
          const outTime = new Date(p.out);
          workMinutes += (outTime - inTime) / (1000 * 60);
        }
        // وضعیت اولیه
        let status = 'absent';
        let delay = false, undertime = false, overtime = false, incompleteDay = false, holiday = false, leaveDay = false;
        let firstIn = pairs.length > 0 ? new Date(pairs[0].in) : null;
        let lastOut = pairs.length > 0 ? new Date(pairs[pairs.length-1].out) : null;
        let delayMinutes = 0, undertimeMinutes = 0, overtimeMinutes = 0;
        if (isHoliday) {
          status = 'holiday';
          holiday = true;
          totalHoliday++;
        } else if (leave) {
          status = 'leave';
          leaveDay = true;
          totalLeave++;
        } else if (attendances.length === 0) {
          status = 'absent';
          totalAbsent++;
        } else if (incomplete) {
          status = 'incomplete';
          incompleteDay = true;
          totalIncomplete++;
        } else {
          status = 'present';
          // بررسی تأخیر
          if (firstIn) {
            const shiftStartTime = new Date(date + 'T' + shiftStart);
            const delayStartTime = new Date(date + 'T' + delayStart);
            const delayEndTime = new Date(date + 'T' + delayEnd);
            if (firstIn > shiftStartTime && firstIn <= delayStartTime) {
              // بدون تأخیر
            } else if (firstIn > delayStartTime && firstIn <= delayEndTime) {
              delay = true;
              delayMinutes = Math.round((firstIn - delayStartTime) / 60000);
              status = 'delay';
              totalDelayCount++;
            } else if (firstIn > delayEndTime) {
              undertime = true;
              undertimeMinutes = Math.round((firstIn - delayEndTime) / 60000);
              status = 'undertime';
              totalUndertimeCount++;
            }
          }
          // بررسی خروج زودتر
          if (lastOut) {
            const shiftEndTime = new Date(date + 'T' + shiftEnd);
            if (lastOut < shiftEndTime) {
              undertime = true;
              undertimeMinutes += Math.round((shiftEndTime - lastOut) / 60000);
              status = 'undertime';
              totalUndertimeCount++;
            }
          }
          // بررسی اضافه‌کاری با مجوز
          const overtimePermission = await overtimePermissionsModel.getPermissionForUserAndDate(user.userId, date);
          if (overtimePermission && lastOut) {
            const overtimeStart = new Date(date + 'T' + overtimePermission.start_time);
            const overtimeEnd = new Date(date + 'T' + overtimePermission.end_time);
            if (lastOut > overtimeStart && lastOut <= overtimeEnd) {
              overtime = true;
              overtimeMinutes = Math.round((lastOut - overtimeStart) / 60000);
              status = 'overtime';
              totalOvertimeCount++;
            }
          }
        }
        totalWorkMinutes += workMinutes;
        totalOvertimeMinutes += overtimeMinutes;
        totalUndertimeMinutes += undertimeMinutes;
        dailyDetails.push({
          date,
          first_in: firstIn ? firstIn.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : null,
          last_out: lastOut ? lastOut.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : null,
          work_hours: workMinutes / 60,
          delay,
          delay_minutes: delayMinutes,
          undertime,
          undertime_minutes: undertimeMinutes,
          overtime,
          overtime_minutes: overtimeMinutes,
          leave: leaveDay,
          holiday,
          incomplete: incompleteDay,
          status
        });
      }
      report.push({
        user_id: user.userId,
        name: user.name,
        department: user.department,
        shift: shift ? shift.name : null,
        month: targetMonth,
        year: targetYear,
        total_work_hours: totalWorkMinutes / 60,
        total_overtime_hours: totalOvertimeMinutes / 60,
        total_undertime_hours: totalUndertimeMinutes / 60,
        delay_days: totalDelayCount,
        undertime_days: totalUndertimeCount,
        overtime_days: totalOvertimeCount,
        incomplete_days: totalIncomplete,
        absent_days: totalAbsent,
        leave_days: totalLeave,
        holiday_days: totalHoliday,
        daily: dailyDetails
      });
    }
    res.json({ data: report });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش تاخیر و غیبت
exports.getLateAbsenceReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // کاربرانی که امروز حضور نداشته‌اند
    const [absentUsers] = await db.query(`
      SELECT u.user_id, u.name, u.department
      FROM users u
      WHERE u.user_id NOT IN (
        SELECT DISTINCT user_id FROM attendances WHERE DATE(timestamp) = ?
      )
    `, [targetDate]);
    
    // کاربرانی که دیر آمده‌اند (بعد از ساعت 8:30)
    const [lateUsers] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.department,
        MIN(a.timestamp) as first_entry
      FROM users u
      JOIN attendances a ON u.user_id = a.user_id 
      WHERE DATE(a.timestamp) = ? AND a.type = 'ورود'
      GROUP BY u.user_id, u.name, u.department
      HAVING MIN(a.timestamp) > CONCAT(?, ' 08:30:00')
    `, [targetDate, targetDate]);
    
    res.json({
      absent: absentUsers,
      late: lateUsers
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش اضافه‌کاری
exports.getOvertimeReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const start = start_date || new Date().toISOString().split('T')[0];
    const end = end_date || new Date().toISOString().split('T')[0];
    
    const [overtime] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.department,
        wt.date,
        wt.overtime_hours,
        wt.undertime_hours
      FROM users u
      JOIN work_times wt ON u.user_id = wt.user_id
      WHERE wt.date BETWEEN ? AND ?
        AND (wt.overtime_hours > 0 OR wt.undertime_hours > 0)
      ORDER BY wt.date DESC, u.name
    `, [start, end]);
    
    res.json({ data: overtime });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش حقوق و دستمزد
exports.getSalaryReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;
    
    const [salaries] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.department,
        s.base_salary,
        s.total_overtime_hours,
        s.total_undertime_hours,
        s.overtime_rate,
        s.bonus,
        s.deductions,
        s.tax,
        s.total_salary,
        s.status,
        s.payment_date
      FROM users u
      LEFT JOIN salaries s ON u.user_id = s.user_id 
        AND s.year = ? AND s.month = ?
      ORDER BY u.name
    `, [targetYear, targetMonth]);
    
    res.json({ data: salaries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش مرخصی
exports.getLeaveReport = async (req, res) => {
  try {
    const { start_date, end_date, status } = req.query;
    const start = start_date || new Date().toISOString().split('T')[0];
    const end = end_date || new Date().toISOString().split('T')[0];
    
    let query = `
      SELECT 
        u.user_id,
        u.name,
        u.department,
        l.type,
        l.start_date,
        l.end_date,
        l.days,
        l.reason,
        l.status,
        l.requested_at
      FROM users u
      JOIN leaves l ON u.user_id = l.user_id
      WHERE l.start_date BETWEEN ? AND ?
    `;
    
    const params = [start, end];
    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY l.start_date DESC, u.name';
    
    const [leaves] = await db.query(query, params);
    res.json({ data: leaves });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش شیفت‌ها
exports.getShiftReport = async (req, res) => {
  try {
    const [shifts] = await db.query(`
      SELECT 
        s.name as shift_name,
        s.start_time,
        s.end_time,
        s.work_hours,
        COUNT(sa.user_id) as assigned_users,
        GROUP_CONCAT(u.name SEPARATOR ', ') as user_names
      FROM shifts s
      LEFT JOIN shift_assignments sa ON s.id = sa.shift_id AND sa.is_active = 1
      LEFT JOIN users u ON sa.user_id = u.user_id
      WHERE s.is_active = 1
      GROUP BY s.id, s.name, s.start_time, s.end_time, s.work_hours
      ORDER BY s.start_time
    `);
    
    res.json({ data: shifts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// نمودار حضور ماهانه
exports.getAttendanceChart = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;
    
    const [chartData] = await db.query(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(DISTINCT user_id) as present_users,
        COUNT(*) as total_records
      FROM attendances
      WHERE YEAR(timestamp) = ? AND MONTH(timestamp) = ?
      GROUP BY DATE(timestamp)
      ORDER BY date
    `, [targetYear, targetMonth]);
    
    res.json({ data: chartData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش عملکرد کارکنان
exports.getEmployeePerformance = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;
    
    const [performance] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.department,
        COUNT(DISTINCT DATE(a.timestamp)) as attendance_days,
        SUM(wt.overtime_hours) as total_overtime,
        SUM(wt.undertime_hours) as total_undertime,
        COUNT(l.id) as leave_count,
        AVG(CASE WHEN l.status = 'approved' THEN 1 ELSE 0 END) as leave_approval_rate
      FROM users u
      LEFT JOIN attendances a ON u.user_id = a.user_id 
        AND YEAR(a.timestamp) = ? AND MONTH(a.timestamp) = ?
      LEFT JOIN work_times wt ON u.user_id = wt.user_id 
        AND YEAR(wt.date) = ? AND MONTH(wt.date) = ?
      LEFT JOIN leaves l ON u.user_id = l.user_id 
        AND YEAR(l.start_date) = ? AND MONTH(l.start_date) = ?
      GROUP BY u.user_id, u.name, u.department
      ORDER BY attendance_days DESC
    `, [targetYear, targetMonth, targetYear, targetMonth, targetYear, targetMonth]);
    
    res.json({ data: performance });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// گزارش حقوق هوشمند برای یک کارمند یا همه
exports.getSmartSalaryReport = async (req, res) => {
  try {
    const { user_id, year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;
    let result = [];
    if (user_id) {
      // فقط یک کارمند
      const salary = await salaryModel.calculateSalary({ user_id, month: targetMonth, year: targetYear });
      result = [salary];
    } else {
      // همه کاربران
      const users = await require('../models/userModel').getAllUsers();
      for (const user of users) {
        try {
          const salary = await salaryModel.calculateSalary({ user_id: user.userId, month: targetMonth, year: targetYear });
          result.push(salary);
        } catch (err) {
          result.push({ user_id: user.userId, name: user.name, error: err.message });
        }
      }
    }
    res.json({ data: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// اعلان‌ها و هشدارهای هوشمند
exports.getSmartNotifications = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const settings = await settingModel.getAllSettings();
    const users = await userModel.getAllUsers();
    const shiftAssignments = await shiftAssignmentModel.getAllAssignments();
    const shifts = await shiftModel.getAllShifts();
    let notifications = [];

    // 1. پایان قرارداد کارمند موقتی
    for (const user of users) {
      if (user.employment_type === 'temporary' && user.contract_end_date) {
        if (user.contract_end_date <= today) {
          notifications.push({
            type: 'contract_end',
            user_id: user.userId,
            name: user.name,
            message: `قرارداد کارمند موقتی (${user.name}) به پایان رسیده است.`
          });
        }
      }
    }

    // 2. تردد ناقص امروز
    for (const user of users) {
      const [attendances] = await db.query(
        `SELECT timestamp, type FROM attendances WHERE user_id = ? AND DATE(timestamp) = ? ORDER BY timestamp`,
        [user.userId, today]
      );
      let lastIn = null;
      let incomplete = false;
      for (const rec of attendances) {
        if (rec.type === 'ورود') lastIn = rec.timestamp;
        else if (rec.type === 'خروج' && lastIn) lastIn = null;
      }
      if (lastIn !== null || attendances.length % 2 !== 0) {
        notifications.push({
          type: 'incomplete_attendance',
          user_id: user.userId,
          name: user.name,
          message: `تردد امروز کاربر (${user.name}) ناقص است.`
        });
      }
    }

    // 3. غیبت بدون مرخصی امروز
    // دریافت مرخصی‌های تاییدشده امروز
    const [leaves] = await db.query(
      `SELECT user_id FROM leaves WHERE start_date <= ? AND end_date >= ? AND status = 'approved'`,
      [today, today]
    );
    const leaveSet = new Set(leaves.map(l => l.user_id));
    for (const user of users) {
      const [attendances] = await db.query(
        `SELECT COUNT(*) as cnt FROM attendances WHERE user_id = ? AND DATE(timestamp) = ?`,
        [user.userId, today]
      );
      if (attendances[0].cnt === 0 && !leaveSet.has(user.userId)) {
        notifications.push({
          type: 'absence',
          user_id: user.userId,
          name: user.name,
          message: `کاربر (${user.name}) امروز بدون مرخصی غایب است.`
        });
      }
    }

    // 4. ورود خارج از ساعت مجاز (تاخیر)
    for (const user of users) {
      // شیفت کاربر
      const assignment = shiftAssignments.find(sa => sa.user_id === user.userId && sa.is_active);
      let shift = null;
      if (assignment) shift = shifts.find(s => s.id === assignment.shift_id);
      const shiftStart = shift ? shift.start_time : (settings.morningStart || '08:00');
      const delayEnd = settings.delayEnd || '08:30';
      const [attendances] = await db.query(
        `SELECT timestamp FROM attendances WHERE user_id = ? AND DATE(timestamp) = ? AND type = 'ورود' ORDER BY timestamp LIMIT 1`,
        [user.userId, today]
      );
      if (attendances.length > 0) {
        const firstIn = new Date(attendances[0].timestamp);
        const shiftStartTime = new Date(today + 'T' + shiftStart);
        const delayEndTime = new Date(today + 'T' + delayEnd);
        if (firstIn > delayEndTime) {
          notifications.push({
            type: 'late_entry',
            user_id: user.userId,
            name: user.name,
            message: `کاربر (${user.name}) امروز با تاخیر زیاد وارد شده است.`
          });
        }
      }
    }

    res.json({ data: notifications });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 