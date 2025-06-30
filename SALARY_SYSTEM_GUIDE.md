# راهنمای کامل سیستم حقوق و دستمزد

## 📋 فهرست مطالب

1. [معرفی سیستم](#معرفی-سیستم)
2. [ساختار دیتابیس](#ساختار-دیتابیس)
3. [فرمول‌های محاسبه](#فرمول‌های-محاسبه)
4. [تنظیمات سیستم](#تنظیمات-سیستم)
5. [API های موجود](#api-های-موجود)
6. [راهنمای استفاده](#راهنمای-استفاده)
7. [عیب‌یابی](#عیب‌یابی)

## 🎯 معرفی سیستم

سیستم حقوق و دستمزد بهبود یافته با قابلیت‌های زیر:

### ✅ ویژگی‌های جدید

- **محاسبه دقیق ساعات کار** بر اساس حضور و غیاب واقعی
- **در نظر گرفتن تعطیلات رسمی** در محاسبات
- **استفاده از تنظیمات سیستم** برای ضریبها و ساعات کاری
- **خروجی اکسل** با فرمت حرفه‌ای
- **تست سیستم** برای بررسی عملکرد
- **نمایش جزئیات کامل** حقوق هر کارمند
- **مدیریت وضعیت پرداخت** (پرداخت شده، در انتظار، ناموفق)

### 🔧 بهبودهای انجام شده

- حذف رکوردهای تکراری از دیتابیس
- اضافه کردن محدودیت‌های یکپارچگی داده
- بهبود فرمول‌های محاسبه
- اضافه کردن ایندکس‌های بهینه
- بهبود رابط کاربری

## 🗄️ ساختار دیتابیس

### جدول `salaries`

```sql
CREATE TABLE salaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  base_salary DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  month INT NOT NULL CHECK (month >= 1 AND month <= 12),
  year INT NOT NULL CHECK (year >= 2020 AND year <= 2030),
  total_overtime_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  total_undertime_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  overtime_rate DECIMAL(5,2) NOT NULL DEFAULT 1.50,
  undertime_rate DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  total_salary DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  bonus DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  deductions DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
  payment_date DATE DEFAULT NULL,
  work_days INT DEFAULT 0,
  total_work_hours DECIMAL(6,2) DEFAULT 0.00,
  hourly_rate DECIMAL(10,2) DEFAULT 0.00,
  overtime_pay DECIMAL(15,2) DEFAULT 0.00,
  undertime_deduction DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_month_year (user_id, month, year),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Views ایجاد شده

```sql
-- خلاصه حقوق کارمندان
CREATE VIEW salary_summary AS
SELECT
    s.id, s.user_id, u.name as employee_name, u.department,
    s.base_salary, s.total_overtime_hours, s.total_undertime_hours,
    s.total_salary, s.status, s.month, s.year,
    s.created_at, s.payment_date,
    ROUND(s.total_salary - s.base_salary, 2) as additional_pay,
    ROUND((s.total_overtime_hours / 176) * 100, 2) as overtime_percentage
FROM salaries s
LEFT JOIN users u ON s.user_id = u.user_id
ORDER BY s.year DESC, s.month DESC, u.name ASC;

-- آمار کلی حقوق
CREATE VIEW salary_statistics AS
SELECT
    month, year, COUNT(*) as total_employees,
    SUM(base_salary) as total_base_salary,
    SUM(total_salary) as total_final_salary,
    SUM(total_overtime_hours) as total_overtime,
    SUM(total_undertime_hours) as total_undertime,
    AVG(total_salary) as avg_salary,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
FROM salaries
GROUP BY month, year
ORDER BY year DESC, month DESC;
```

## 🧮 فرمول‌های محاسبه

### 1. محاسبه ساعات کار روزانه

```javascript
// دریافت تنظیمات ساعات کاری
const morningStart = "08:00";
const morningEnd = "12:00";
const afternoonStart = "13:00";
const afternoonEnd = "17:00";

// محاسبه ساعات کاری مورد انتظار
const expectedHours =
  (morningEnd - morningStart + (afternoonEnd - afternoonStart)) / 3600000;

// محاسبه اضافه‌کاری و کم‌کاری
const overtime = Math.max(0, actualWorkHours - expectedHours);
const undertime = Math.max(0, expectedHours - actualWorkHours);
```

### 2. محاسبه حقوق نهایی

```javascript
// نرخ ساعتی
const hourlyRate = baseSalary / monthlyWorkHours; // معمولاً 176 ساعت

// محاسبه اضافه‌کاری
const overtimePay = totalOvertime * hourlyRate * overtimeCoefficient;

// محاسبه کم‌کاری
const undertimeDeduction = totalUndertime * hourlyRate * undertimeCoefficient;

// محاسبه مالیات
const taxAmount =
  (baseSalary + overtimePay - undertimeDeduction) * (taxRate / 100);

// حقوق نهایی
const finalSalary =
  baseSalary +
  overtimePay -
  undertimeDeduction -
  taxAmount +
  bonus -
  deductions;
```

## ⚙️ تنظیمات سیستم

### تنظیمات موجود در جدول `settings`

| کلید                 | توضیح             | مقدار پیش‌فرض |
| -------------------- | ----------------- | ------------- |
| `coef_overtime`      | ضریب اضافه‌کاری   | 1.5           |
| `coef_undertime`     | ضریب کم‌کاری      | 0.5           |
| `coef_tax`           | درصد مالیات       | 0             |
| `coef_bonus`         | ضریب پاداش        | 0             |
| `monthly_work_hours` | ساعات کاری ماهانه | 176           |
| `morningStart`       | شروع صبح          | 08:00         |
| `morningEnd`         | پایان صبح         | 12:00         |
| `afternoonStart`     | شروع عصر          | 13:00         |
| `afternoonEnd`       | پایان عصر         | 17:00         |

### تنظیم تعطیلات رسمی

```sql
INSERT INTO settings (setting_key, setting_value, description)
VALUES ('holiday_2025-01-01', 'روز سال نو', 'تعطیل رسمی - 2025-01-01');
```

## 🔌 API های موجود

### 1. دریافت لیست حقوق

```http
GET /api/salaries?month=6&year=2025
```

### 2. محاسبه حقوق یک کاربر

```http
POST /api/salaries/calculate
Content-Type: application/json

{
  "user_id": "1",
  "month": 6,
  "year": 2025,
  "tax": 0,
  "bonus": 0,
  "deductions": 0
}
```

### 3. محاسبه حقوق همه کاربران

```http
POST /api/salaries/calculate-all
Content-Type: application/json

{
  "month": 6,
  "year": 2025
}
```

### 4. تغییر وضعیت پرداخت

```http
PUT /api/salaries/{id}/pay
Content-Type: application/json

{
  "status": "paid",
  "payment_date": "2025-06-30",
  "bonus": 0,
  "deductions": 0,
  "tax": 0
}
```

### 5. خروجی اکسل

```http
GET /api/salaries/export?month=6&year=2025
```

### 6. تست سیستم

```http
GET /api/salaries/test
```

## 📖 راهنمای استفاده

### مرحله 1: اجرای فیکس دیتابیس

```sql
-- اجرای فایل fixed_salaries_table.sql
source fixed_salaries_table.sql;
```

### مرحله 2: تنظیم پارامترهای سیستم

```sql
-- تنظیم ضریب اضافه‌کاری
UPDATE settings SET setting_value = '1.5' WHERE setting_key = 'coef_overtime';

-- تنظیم ضریب کم‌کاری
UPDATE settings SET setting_value = '0.5' WHERE setting_key = 'coef_undertime';

-- تنظیم ساعات کاری ماهانه
UPDATE settings SET setting_value = '176' WHERE setting_key = 'monthly_work_hours';
```

### مرحله 3: محاسبه حقوق

1. به صفحه حقوق و دستمزد بروید
2. ماه و سال مورد نظر را انتخاب کنید
3. روی "محاسبه همه حقوق" کلیک کنید
4. منتظر بمانید تا محاسبات تمام شود

### مرحله 4: بررسی نتایج

- جدول حقوق را بررسی کنید
- آمار کلی را مشاهده کنید
- در صورت نیاز، حقوق فردی را مجدداً محاسبه کنید

### مرحله 5: خروجی اکسل

- روی دکمه "خروجی اکسل" کلیک کنید
- فایل اکسل دانلود خواهد شد

## 🔧 عیب‌یابی

### مشکل 1: خطای "کاربر یافت نشد"

**علت:** کاربر در جدول `users` وجود ندارد یا حقوق پایه صفر است
**راه حل:**

```sql
-- بررسی وجود کاربر
SELECT * FROM users WHERE user_id = 'USER_ID';

-- تنظیم حقوق پایه
UPDATE users SET salary = 20000 WHERE user_id = 'USER_ID';
```

### مشکل 2: محاسبات نادرست

**علت:** تنظیمات سیستم نادرست است
**راه حل:**

```sql
-- بررسی تنظیمات
SELECT * FROM settings WHERE setting_key LIKE 'coef_%';

-- تنظیم مجدد
UPDATE settings SET setting_value = '1.5' WHERE setting_key = 'coef_overtime';
```

### مشکل 3: رکوردهای تکراری

**علت:** محدودیت unique نقض شده
**راه حل:**

```sql
-- حذف رکوردهای تکراری
DELETE s1 FROM salaries s1
INNER JOIN salaries s2
WHERE s1.id < s2.id
AND s1.user_id = s2.user_id
AND s1.month = s2.month
AND s1.year = s2.year;
```

### مشکل 4: خطای API

**علت:** سرور در حال اجرا نیست یا مسیر اشتباه است
**راه حل:**

1. بررسی اجرای سرور: `node server.cjs`
2. بررسی مسیرهای API در `server.cjs`
3. بررسی لاگ‌های سرور

## 📊 گزارش‌گیری

### گزارش خلاصه ماهانه

```sql
SELECT * FROM salary_statistics WHERE month = 6 AND year = 2025;
```

### گزارش تفصیلی کارمندان

```sql
SELECT * FROM salary_summary WHERE month = 6 AND year = 2025;
```

### گزارش اضافه‌کاری

```sql
SELECT
    u.name,
    s.total_overtime_hours,
    s.overtime_pay,
    ROUND((s.total_overtime_hours / 176) * 100, 2) as overtime_percentage
FROM salaries s
JOIN users u ON s.user_id = u.user_id
WHERE s.month = 6 AND s.year = 2025
ORDER BY s.total_overtime_hours DESC;
```

## 🎯 نکات مهم

1. **قبل از محاسبه حقوق:** اطمینان حاصل کنید که داده‌های حضور و غیاب کامل است
2. **تنظیمات سیستم:** پارامترهای سیستم را قبل از محاسبه تنظیم کنید
3. **پشتیبان‌گیری:** قبل از اجرای فیکس دیتابیس، از داده‌ها پشتیبان تهیه کنید
4. **تست:** همیشه ابتدا روی داده‌های تست محاسبات را انجام دهید
5. **نظارت:** نتایج محاسبات را بررسی کنید تا از صحت آنها اطمینان حاصل کنید

## 📞 پشتیبانی

در صورت بروز مشکل یا نیاز به راهنمایی بیشتر، لطفاً موارد زیر را بررسی کنید:

- لاگ‌های سرور
- خطاهای کنسول مرورگر
- وضعیت اتصال دیتابیس
- صحت داده‌های ورودی
