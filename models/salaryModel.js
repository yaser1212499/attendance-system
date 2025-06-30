const db = require('../config/db');
const settingModel = require('./settingModel');
const overtimePermissionsModel = require('./overtimePermissionsModel');
const userModel = require('./userModel');
const shiftAssignmentModel = require('./shiftAssignmentModel');
const shiftModel = require('./shiftModel');

// تابع هوشمند محاسبه حقوق
exports.calculateSalary = async ({ user_id, month, year }) => {
  try {
    // دریافت اطلاعات کاربر
    const [[user]] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (!user) throw new Error('کاربر یافت نشد');
    const settings = await settingModel.getAllSettings();
    const assignment = (await shiftAssignmentModel.getAllAssignments()).find(sa => sa.user_id === user_id && sa.is_active);
    let shift = null;
    if (assignment) shift = (await shiftModel.getAllShifts()).find(s => s.id === assignment.shift_id);
    const shiftStart = shift ? shift.start_time : (settings.morningStart || '08:00');
    const shiftEnd = shift ? shift.end_time : (settings.afternoonEnd || '16:00');
    const delayStart = settings.delayStart || '08:15';
    const delayEnd = settings.delayEnd || '08:30';
    const daysInMonth = new Date(year, month, 0).getDate();

    // تعطیلات رسمی
    const holidays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      if (settings[`holiday_${date}`]) holidays.push(date);
    }

    // دریافت مرخصی‌های تاییدشده برای این ماه
    const [leaves] = await db.query(
      `SELECT user_id, type, status, start_date, end_date FROM leaves WHERE user_id = ? AND (
        (YEAR(start_date) = ? AND MONTH(start_date) = ?) OR (YEAR(end_date) = ? AND MONTH(end_date) = ?)
      ) AND status = 'approved'`,
      [user_id, year, month, year, month]
    );
    // ساخت نقشه مرخصی برای هر روز
    const leaveMap = {};
    for (const l of leaves) {
      let cur = new Date(l.start_date);
      const end = new Date(l.end_date);
      while (cur <= end) {
        const dateStr = cur.toISOString().split('T')[0];
        leaveMap[dateStr] = l;
        cur.setDate(cur.getDate() + 1);
      }
    }

    // پارامترهای حقوق
    let totalWorkMinutes = 0, totalOvertimeMinutes = 0, totalUndertimeMinutes = 0, totalDelayMinutes = 0, totalAbsent = 0, totalLeave = 0, totalHoliday = 0;
    let overtimePay = 0, undertimePenalty = 0, delayPenalty = 0, absencePenalty = 0;
    let dailyDetails = [];

    // نرخ‌ها
    const baseSalary = Number(user.salary) || 0;
    const salaryType = user.salary_type || 'monthly';
    const hourlyRate = salaryType === 'monthly' ? (baseSalary / (settings.monthly_work_hours ? Number(settings.monthly_work_hours) : 176)) : (baseSalary);
    const overtimeCoef = settings.coef_overtime ? Number(settings.coef_overtime) : 1.5;
    const undertimeCoef = settings.coef_undertime ? Number(settings.coef_undertime) : 1;
    const delayCoef = settings.coef_delay ? Number(settings.coef_delay) : 1;
    const absenceCoef = settings.coef_absence ? Number(settings.coef_absence) : 1;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const isHoliday = holidays.includes(date);
      const leave = leaveMap[date];
      // ترددهای امروز
      const [attendances] = await db.query(
        `SELECT timestamp, type FROM attendances WHERE user_id = ? AND DATE(timestamp) = ? ORDER BY timestamp`,
        [user_id, date]
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
            totalDelayMinutes += delayMinutes;
            status = 'delay';
          } else if (firstIn > delayEndTime) {
            undertime = true;
            undertimeMinutes = Math.round((firstIn - delayEndTime) / 60000);
            totalUndertimeMinutes += undertimeMinutes;
            status = 'undertime';
          }
        }
        // بررسی خروج زودتر
        if (lastOut) {
          const shiftEndTime = new Date(date + 'T' + shiftEnd);
          if (lastOut < shiftEndTime) {
            undertime = true;
            undertimeMinutes += Math.round((shiftEndTime - lastOut) / 60000);
            totalUndertimeMinutes += Math.round((shiftEndTime - lastOut) / 60000);
            status = 'undertime';
          }
        }
        // بررسی اضافه‌کاری با مجوز
        const overtimePermission = await overtimePermissionsModel.getPermissionForUserAndDate(user_id, date);
        if (overtimePermission && lastOut) {
          const overtimeStart = new Date(date + 'T' + overtimePermission.start_time);
          const overtimeEnd = new Date(date + 'T' + overtimePermission.end_time);
          if (lastOut > overtimeStart && lastOut <= overtimeEnd) {
            overtime = true;
            overtimeMinutes = Math.round((lastOut - overtimeStart) / 60000);
            totalOvertimeMinutes += overtimeMinutes;
            status = 'overtime';
          }
        }
      }
      totalWorkMinutes += workMinutes;
      dailyDetails.push({
        date,
        status,
        work_hours: workMinutes / 60,
        delay_minutes: delayMinutes,
        undertime_minutes: undertimeMinutes,
        overtime_minutes: overtimeMinutes,
        leave: leaveDay,
        holiday,
        incomplete: incompleteDay
      });
    }
    // محاسبه حقوق بر اساس نوع پرداخت
    let netSalary = 0;
    if (salaryType === 'monthly') {
      netSalary = baseSalary;
    } else if (salaryType === 'daily') {
      netSalary = (baseSalary * (daysInMonth - totalAbsent - totalHoliday - totalLeave)) / daysInMonth;
    } else if (salaryType === 'weekly') {
      netSalary = (baseSalary * ((daysInMonth - totalAbsent - totalHoliday - totalLeave) / 7));
    } else if (salaryType === 'hourly') {
      netSalary = hourlyRate * (totalWorkMinutes / 60);
    }
    // اضافه‌کاری
    overtimePay = (totalOvertimeMinutes / 60) * hourlyRate * overtimeCoef;
    // جریمه کم‌کاری
    undertimePenalty = (totalUndertimeMinutes / 60) * hourlyRate * undertimeCoef;
    // جریمه تأخیر
    delayPenalty = (totalDelayMinutes / 60) * hourlyRate * delayCoef;
    // جریمه غیبت
    absencePenalty = totalAbsent * hourlyRate * 8 * absenceCoef;
    // حقوق خالص
    let finalSalary = netSalary + overtimePay - undertimePenalty - delayPenalty - absencePenalty;
    return {
      user_id,
      name: user.name,
      base_salary: baseSalary,
      salary_type: salaryType,
      total_work_hours: totalWorkMinutes / 60,
      total_overtime_hours: totalOvertimeMinutes / 60,
      total_undertime_hours: totalUndertimeMinutes / 60,
      total_delay_minutes: totalDelayMinutes,
      absent_days: totalAbsent,
      leave_days: totalLeave,
      holiday_days: totalHoliday,
      overtime_pay: overtimePay,
      undertime_penalty: undertimePenalty,
      delay_penalty: delayPenalty,
      absence_penalty: absencePenalty,
      net_salary: finalSalary,
      daily: dailyDetails
    };
  } catch (error) {
    throw error;
  }
};

// تابع دریافت لیست حقوق
exports.getSalaries = async (month, year) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.*,
        u.name,
        u.department
      FROM salaries s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.month = ? AND s.year = ?
      ORDER BY u.name
    `, [month, year]);
    
    return rows;
  } catch (error) {
    throw error;
  }
}; 