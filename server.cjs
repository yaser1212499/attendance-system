const express = require('express');
const cors = require('cors');
const iconv = require('iconv-lite');
const mysql = require('mysql2/promise');
const ZKJUBAER = require('zk-jubaer');
const shiftRoutes = require('./routes/shiftRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const workTimeRoutes = require('./routes/workTimeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const bcrypt = require('bcryptjs');

// Helper functions
function calculateWorkHours(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.abs(diffHours);
}

function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // شامل روز شروع
}

// Function to get device settings from database
async function getDeviceSettings() {
  try {
    const connection = await dbPool.getConnection();
    const [rows] = await connection.query(
      'SELECT setting_key, setting_value FROM settings WHERE setting_key IN (?, ?, ?, ?)',
      ['deviceIP', 'devicePort', 'deviceName', 'deviceLocation']
    );
    connection.release();
    
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    
    // Default values if not found in database
    return {
      deviceIP: settings.deviceIP || '192.168.0.50',
      devicePort: parseInt(settings.devicePort) || 4370,
      deviceName: settings.deviceName || 'دستگاه اصلی',
      deviceLocation: settings.deviceLocation || 'ورودی اصلی'
    };
  } catch (error) {
    console.error('Error getting device settings:', error);
    // Return default values if database query fails
    return {
      deviceIP: '192.168.0.50',
      devicePort: 4370,
      deviceName: 'دستگاه اصلی',
      deviceLocation: 'ورودی اصلی'
    };
  }
}

// Function to create ZK connection with dynamic settings
async function createZKConnection(timeout = 10000) {
  const deviceSettings = await getDeviceSettings();
  console.log(`Attempting to connect to device at ${deviceSettings.deviceIP}:${deviceSettings.devicePort}`);
  return new ZKJUBAER(deviceSettings.deviceIP, deviceSettings.devicePort, timeout, 5200);
}

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Standard for XAMPP
  database: 'attendance_system4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to initialize the database and create tables
async function initDatabase() {
  try {
    const connection = await dbPool.getConnection();
    console.log('Successfully connected to the MySQL database.');

    // Create attendances table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        timestamp DATETIME NOT NULL,
        type ENUM('ورود', 'خروج') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_log (user_id, timestamp),
        device_id VARCHAR(100) DEFAULT NULL
      )
    `);
    console.log('`attendances` table is ready.');

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        password VARCHAR(255),
        role INT,
        cardno VARCHAR(255),
        province VARCHAR(100),
        district VARCHAR(100),
        salary DECIMAL(10,2),
        shift VARCHAR(50),
        department VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        hire_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('`users` table is ready.');

    // Create shifts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS shifts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        color VARCHAR(7) DEFAULT '#007bff',
        work_hours DECIMAL(4,2),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('`shifts` table is ready.');

    // Create shift_assignments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS shift_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        shift_id INT NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
        UNIQUE KEY unique_assignment (user_id, shift_id),
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL
      )
    `);
    console.log('`shift_assignments` table is ready.');

    // Create leaves table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type ENUM('annual', 'sick', 'emergency', 'maternity', 'other') NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        days INT NOT NULL,
        reason TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        manager_comment TEXT,
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        hour_from TIME DEFAULT NULL,
        hour_to TIME DEFAULT NULL
      )
    `);
    console.log('`leaves` table is ready.');

    // Create notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('`notifications` table is ready.');

    // Create settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('`settings` table is ready.');

    // Create work_times table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS work_times (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        overtime_hours DECIMAL(5,2) DEFAULT 0,
        undertime_hours DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        type ENUM('manual','auto') DEFAULT 'manual'
      )
    `);
    console.log('`work_times` table is ready.');

    // Create salaries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS salaries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        base_salary DECIMAL(15,2) NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        total_overtime_hours DECIMAL(6,2) DEFAULT 0,
        total_undertime_hours DECIMAL(6,2) DEFAULT 0,
        overtime_rate DECIMAL(5,2) DEFAULT 1.5,
        undertime_rate DECIMAL(5,2) DEFAULT 1.0,
        total_salary DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        tax DECIMAL(15,2) DEFAULT 0.00,
        bonus DECIMAL(15,2) DEFAULT 0.00,
        deductions DECIMAL(15,2) DEFAULT 0.00,
        payment_date DATE DEFAULT NULL,
        status ENUM('pending','paid','failed') DEFAULT 'pending'
      )
    `);
    console.log('`salaries` table is ready.');

    // Add new columns to existing users table if they don't exist
    try {
      await connection.query('ALTER TABLE users ADD COLUMN province VARCHAR(100)');
      console.log('Added province column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding province column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN district VARCHAR(100)');
      console.log('Added district column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding district column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN salary DECIMAL(10,2)');
      console.log('Added salary column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding salary column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN shift VARCHAR(50)');
      console.log('Added shift column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding shift column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN department VARCHAR(100)');
      console.log('Added department column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding department column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
      console.log('Added phone column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding phone column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN email VARCHAR(100)');
      console.log('Added email column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding email column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN address TEXT');
      console.log('Added address column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding address column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN hire_date DATE');
      console.log('Added hire_date column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding hire_date column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log('Added created_at column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding created_at column:', e);
      }
    }

    try {
      await connection.query('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
      console.log('Added updated_at column to users table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding updated_at column:', e);
      }
    }

    // --- اصلاحات حرفه‌ای جداول ---
    // ۱. جدول salaries
    try {
      await connection.query("ALTER TABLE salaries ADD COLUMN tax DECIMAL(15,2) DEFAULT 0.00");
      await connection.query("ALTER TABLE salaries ADD COLUMN bonus DECIMAL(15,2) DEFAULT 0.00");
      await connection.query("ALTER TABLE salaries ADD COLUMN deductions DECIMAL(15,2) DEFAULT 0.00");
      await connection.query("ALTER TABLE salaries ADD COLUMN payment_date DATE DEFAULT NULL");
      await connection.query("ALTER TABLE salaries ADD COLUMN status ENUM('pending','paid','failed') DEFAULT 'pending'");
      console.log('Added columns to salaries table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding columns to salaries:', e);
      }
    }
    // ۲. جدول work_times
    try {
      await connection.query("ALTER TABLE work_times ADD COLUMN type ENUM('manual','auto') DEFAULT 'manual'");
      console.log('Added type column to work_times table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding type to work_times:', e);
      }
    }
    // ۳. جدول attendances
    try {
      await connection.query("ALTER TABLE attendances ADD COLUMN device_id VARCHAR(100) DEFAULT NULL");
      console.log('Added device_id column to attendances table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding device_id to attendances:', e);
      }
    }
    // ۴. جدول leaves
    try {
      await connection.query("ALTER TABLE leaves ADD COLUMN hour_from TIME DEFAULT NULL");
      await connection.query("ALTER TABLE leaves ADD COLUMN hour_to TIME DEFAULT NULL");
      console.log('Added hour_from and hour_to to leaves table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding hour_from/hour_to to leaves:', e);
      }
    }
    // ۵. جدول shift_assignments
    try {
      await connection.query("ALTER TABLE shift_assignments ADD COLUMN start_date DATE DEFAULT NULL");
      await connection.query("ALTER TABLE shift_assignments ADD COLUMN end_date DATE DEFAULT NULL");
      console.log('Added start_date and end_date to shift_assignments table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding start_date/end_date to shift_assignments:', e);
      }
    }

    connection.release();
  } catch (err) {
    console.error('Database connection or table creation failed:', err);
    process.exit(1);
  }
}

// افزودن کلیدهای ضرایب به جدول settings اگر وجود ندارند
async function ensureSalaryCoefficients() {
  const connection = await dbPool.getConnection();
  const keys = [
    { key: 'coef_overtime', def: '1.5', desc: 'ضریب اضافه‌کاری' },
    { key: 'coef_undertime', def: '0.5', desc: 'ضریب کم‌کاری' }, // اصلاح شده از 9 به 0.5
    { key: 'coef_tax', def: '1.0', desc: 'ضریب مالیات' },
    { key: 'coef_bonus', def: '1.0', desc: 'ضریب پاداش' },
    { key: 'monthly_work_hours', def: '176', desc: 'ساعات کاری ماهانه (22 روز × 8 ساعت)' }
  ];
  for (const k of keys) {
    await connection.query(
      `INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)`,
      [k.key, k.def, k.desc]
    );
  }
  connection.release();
}

// API to get ALL data from DB
app.get('/api/data', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const connection = await dbPool.getConnection();
    
    // Get users (no pagination needed for this)
    const [dbUsers] = await connection.query("SELECT user_id AS userId, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date FROM users");
    
    // Get total count of attendance logs
    const [[{ total }]] = await connection.query("SELECT COUNT(*) as total FROM attendances");
    
    // Get paginated attendance logs, newest first
    const [dbLogs] = await connection.query(
      `SELECT user_id AS deviceUserId, timestamp AS recordTime, type 
       FROM attendances 
       ORDER BY timestamp DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    connection.release();
    res.json({
      users: { data: dbUsers },
      logs: { data: dbLogs, total: total }
    });
  } catch (e) {
    console.error('Error in /api/data:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to get attendance data only (for reports page)
app.get('/api/attendance', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const connection = await dbPool.getConnection();
    
    // Get total count of attendance logs
    const [[{ total }]] = await connection.query("SELECT COUNT(*) as total FROM attendances");
    
    // Get paginated attendance logs, newest first
    const [dbLogs] = await connection.query(
      `SELECT user_id AS deviceUserId, timestamp AS recordTime, type, device_id FROM attendances ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    connection.release();
    res.json({
      data: dbLogs,
      total: total
    });
  } catch (e) {
    console.error('Error in /api/attendance:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to SYNC users from device to DB
app.post('/api/sync-users', async (req, res) => {
  try {
    const zk = await createZKConnection(10000);
    await zk.createSocket();
    const usersResponse = await zk.getUsers();
    await zk.disconnect();

    const users = usersResponse.data || usersResponse;
    const connection = await dbPool.getConnection();
    
    for (const user of users) {
      const name = user.name ? iconv.decode(Buffer.from(user.name, 'binary'), 'utf8').replace(/\0/g, '').trim() : '';
      await connection.query(
        `INSERT INTO users (user_id, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name), 
         password = VALUES(password), 
         role = VALUES(role), 
         cardno = VALUES(cardno),
         province = COALESCE(VALUES(province), province),
         district = COALESCE(VALUES(district), district),
         salary = COALESCE(VALUES(salary), salary),
         shift = COALESCE(VALUES(shift), shift),
         department = COALESCE(VALUES(department), department),
         phone = COALESCE(VALUES(phone), phone),
         email = COALESCE(VALUES(email), email),
         address = COALESCE(VALUES(address), address),
         hire_date = COALESCE(VALUES(hire_date), hire_date)`,
        [user.userId, name, user.password || '', user.role || 0, user.cardno || '0', 
         null, null, null, null, null, null, null, null, null]
      );
    }
    
    connection.release();
    console.log(`Synced ${users.length} users to the database.`);
    res.json({ success: true, message: `Synced ${users.length} users.` });
  } catch (e) {
    console.error('Error in /api/sync-users:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to SYNC attendance logs from device to DB
app.post('/api/sync-attendances', async (req, res) => {
  try {
    const zk = await createZKConnection(15000);
    await zk.createSocket();
    const deviceLogsResponse = await zk.getAttendances();
    await zk.disconnect();

    const logsArray = deviceLogsResponse.data || deviceLogsResponse;
    if (!Array.isArray(logsArray)) {
      console.error('getAttendances did not return an array:', logsArray);
      return res.status(500).json({ error: 'Failed to retrieve logs from device in a correct format.' });
    }

    const connection = await dbPool.getConnection();
    let newLogsCount = 0;

    const sortedLogs = logsArray.sort((a, b) => new Date(a.recordTime) - new Date(b.recordTime));

    for (const log of sortedLogs) {
      const { deviceUserId, recordTime, deviceId = null } = log;
      if (!deviceUserId) continue;

      const timestamp = new Date(recordTime);

      const [existing] = await connection.query(
        'SELECT id FROM attendances WHERE user_id = ? AND timestamp = ?',
        [deviceUserId, timestamp]
      );

      if (existing.length === 0) {
        const [lastLog] = await connection.query(
          'SELECT type FROM attendances WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
          [deviceUserId]
        );
        const lastType = lastLog.length > 0 ? lastLog[0].type : 'خروج';
        const newType = lastType === 'ورود' ? 'خروج' : 'ورود';

        await connection.query(
          'INSERT INTO attendances (user_id, timestamp, type, device_id) VALUES (?, ?, ?, ?)',
          [deviceUserId, timestamp, newType, deviceId]
        );
        newLogsCount++;
      }
    }

    connection.release();
    console.log(`Synced ${newLogsCount} new attendance logs.`);
    res.json({ success: true, message: `Synced ${newLogsCount} new logs.` });
  } catch (e) {
    console.error('Error in /api/sync-attendances:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to set/update user (device and DB)
app.post('/api/zk/user', async (req, res) => {
    let { userId, name, password, role = 0, cardno = 0, province, district, salary, shift, department, phone, email, address, hire_date } = req.body;
    console.log('--- [DEBUG] /api/zk/user called ---');
    console.log('Received fields:', JSON.stringify(req.body, null, 2));
    if (!name) {
        return res.status(400).json({ error: 'name is required.' });
    }
    // تولید خودکار شناسه اگر userId وجود نداشت
    if (!userId) {
        let prefix = role == 2 ? 'PERS' : 'USER';
        const connection = await dbPool.getConnection();
        const [last] = await connection.query(`SELECT user_id FROM users WHERE user_id LIKE '${prefix}%' ORDER BY user_id DESC LIMIT 1`);
        let nextId;
        if (last.length === 0) {
            nextId = prefix + '001';
        } else {
            const lastId = last[0].user_id;
            const num = parseInt(lastId.replace(prefix, '')) + 1;
            nextId = prefix + num.toString().padStart(3, '0');
        }
        userId = nextId;
        connection.release();
    }
    // هش کردن رمز عبور اگر وجود دارد و پرسنل نیست
    if (password && role != 2) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
    } else if (role == 2) {
        password = '';
    }
    // بررسی اتصال دستگاه
    let deviceConnected = false;
    try {
        const zk = await createZKConnection(10000);
        await zk.createSocket();
        deviceConnected = true;
        try {
            // فقط برای کاربر و ادمین (role=0 یا 14)
            let deviceUserId = 0;
            let safeUserId = '';
            let deviceCardNo = '';
            if (role === 0 || role === 14) {
                // دریافت لیست کاربران فعلی دستگاه و تعیین uid یکتا
                let deviceUsers = [];
                try {
                    const usersResp = await zk.getUsers();
                    deviceUsers = usersResp.data || usersResp;
                } catch (e) { deviceUsers = []; }
                const usedUids = deviceUsers.map(u => u.uid || parseInt((u.userId + '').replace(/\D/g, ''), 10)).filter(x => !isNaN(x));
                deviceUserId = Math.max(...usedUids, 0) + 1;
                safeUserId = String(deviceUserId).slice(0, 8);
                deviceCardNo = cardno && cardno !== '' ? String(cardno).replace(/\D/g, '').slice(0, 8) : safeUserId;
            } else {
                // برای پرسنل همان منطق قبلی
                deviceUserId = parseInt((userId + '').replace(/\D/g, ''), 10) || 0;
                safeUserId = (userId + '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
                deviceCardNo = cardno && cardno !== '' ? cardno : '0';
            }
            const safePassword = (password || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
            await zk.setUser(deviceUserId, safeUserId, name, safePassword, role, deviceCardNo);
        } catch (setUserErr) {
            deviceConnected = false;
            console.error('ZK setUser error:', setUserErr);
        }
        await zk.disconnect();
    } catch (e) {
        deviceConnected = false;
        console.error('ZK device connection error:', e);
    }
    // ثبت در دیتابیس
        const connection = await dbPool.getConnection();
    try {
        await connection.query(
            `INSERT INTO users (user_id, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             name = VALUES(name), 
             password = VALUES(password), 
             role = VALUES(role), 
             cardno = VALUES(cardno),
             province = VALUES(province),
             district = VALUES(district),
             salary = VALUES(salary),
             shift = VALUES(shift),
             department = VALUES(department),
             phone = VALUES(phone),
             email = VALUES(email),
             address = VALUES(address),
             hire_date = VALUES(hire_date)`
            , [userId, name, password || '', role, cardno || '0', province, district, salary, shift, department, phone, email, address, hire_date]
        );
        // اگر دستگاه متصل نبود، کاربر را در صف sync ذخیره کن
        if (!deviceConnected) {
            await connection.query(
                `INSERT INTO pending_device_users (user_id, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                , [userId, name, password || '', role, cardno || '0', province, district, salary, shift, department, phone, email, address, hire_date]
            );
        }
        connection.release();
        res.json({ success: true, userId, deviceConnected });
    } catch (dbErr) {
        connection.release();
        console.error('DB ERROR in /api/zk/user:', dbErr);
        res.status(500).json({ success: false, error: dbErr.message });
        return;
    }
});

// API to get dashboard statistics
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    
    // Get total users count
    const [[{ totalUsers }]] = await connection.query("SELECT COUNT(*) as totalUsers FROM users");
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's check-ins
    const [[{ todayCheckins }]] = await connection.query(
      "SELECT COUNT(*) as todayCheckins FROM attendances WHERE DATE(timestamp) = ? AND type = 'ورود'",
      [today]
    );
    
    // Get today's check-outs
    const [[{ todayCheckouts }]] = await connection.query(
      "SELECT COUNT(*) as todayCheckouts FROM attendances WHERE DATE(timestamp) = ? AND type = 'خروج'",
      [today]
    );
    
    connection.release();
    
    res.json({
      totalUsers,
      todayCheckins,
      todayCheckouts,
      date: today
    });
  } catch (e) {
    console.error('Error in /api/dashboard-stats:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to check device connection status
app.get('/api/device-status', async (req, res) => {
  try {
    const zk = await createZKConnection(5000);
    const startTime = Date.now();
    await zk.createSocket();
    const connectionTime = Date.now() - startTime;
    
    // Just test connection, don't call getDeviceInfo
    await zk.disconnect();
    
    res.json({
      connected: true,
      connectionTime: connectionTime,
      timestamp: new Date().toISOString(),
      message: 'دستگاه با موفقیت متصل شد'
    });
  } catch (e) {
    console.error('Device connection test failed:', e);
    res.json({
      connected: false,
      error: e.message,
      timestamp: new Date().toISOString(),
      message: 'خطا در اتصال به دستگاه'
    });
  }
});

// API to get device settings and test connection
app.get('/api/device-info', async (req, res) => {
  try {
    const deviceSettings = await getDeviceSettings();
    
    // Test connection
    let connectionStatus = { connected: false, error: null };
    try {
      const zk = await createZKConnection(5000);
      await zk.createSocket();
      connectionStatus = { connected: true, error: null };
      await zk.disconnect();
    } catch (e) {
      connectionStatus = { connected: false, error: e.message };
    }
    
    res.json({
      settings: deviceSettings,
      connection: connectionStatus,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error getting device info:', e);
    res.status(500).json({ error: e.message });
  }
});

// Start the server and listeners
app.listen(3001, async () => {
  console.log('ZKTeco API server running on port 3001');
  await initDatabase();
  await ensureSalaryCoefficients();
});

// ========== NEW APIs FOR COMPLETE SYSTEM ==========

// API to manage shifts
app.get('/api/shifts', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [shifts] = await connection.query("SELECT * FROM shifts WHERE is_active = TRUE ORDER BY name");
    connection.release();
    res.json({ data: shifts });
  } catch (e) {
    console.error('Error in /api/shifts:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/shifts', async (req, res) => {
  try {
    const { name, start_time, end_time, color } = req.body;
    const connection = await dbPool.getConnection();
    
    const work_hours = calculateWorkHours(start_time, end_time);
    
    await connection.query(
      "INSERT INTO shifts (name, start_time, end_time, color, work_hours) VALUES (?, ?, ?, ?, ?)",
      [name, start_time, end_time, color || '#007bff', work_hours]
    );
    
    connection.release();
    res.json({ success: true, message: 'شیفت با موفقیت ایجاد شد' });
  } catch (e) {
    console.error('Error in /api/shifts POST:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/shifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "UPDATE shifts SET is_active = FALSE WHERE id = ?",
      [id]
    );
    
    connection.release();
    res.json({ success: true, message: 'شیفت با موفقیت حذف شد' });
  } catch (e) {
    console.error('Error in /api/shifts DELETE:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to manage shift assignments
app.get('/api/shift-assignments', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [assignments] = await connection.query(`
      SELECT sa.*, u.name as user_name, s.name as shift_name, s.start_time, s.end_time, s.color
      FROM shift_assignments sa
      JOIN users u ON sa.user_id = u.user_id
      JOIN shifts s ON sa.shift_id = s.id
      WHERE sa.is_active = TRUE
      ORDER BY sa.assigned_at DESC
    `);
    connection.release();
    res.json({ data: assignments });
  } catch (e) {
    console.error('Error in /api/shift-assignments:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/shift-assignments', async (req, res) => {
  try {
    const { user_id, shift_id, start_date = null, end_date = null } = req.body;
    const connection = await dbPool.getConnection();
    
    // Remove existing assignment for this user
    await connection.query(
      "UPDATE shift_assignments SET is_active = FALSE WHERE user_id = ?",
      [user_id]
    );
    
    // Add new assignment
    await connection.query(
      "INSERT INTO shift_assignments (user_id, shift_id, start_date, end_date) VALUES (?, ?, ?, ?)",
      [user_id, shift_id, start_date, end_date]
    );
    
    connection.release();
    res.json({ success: true, message: 'شیفت با موفقیت تخصیص داده شد' });
  } catch (e) {
    console.error('Error in /api/shift-assignments POST:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/shift-assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "UPDATE shift_assignments SET is_active = FALSE WHERE id = ?",
      [id]
    );
    
    connection.release();
    res.json({ success: true, message: 'تخصیص شیفت با موفقیت حذف شد' });
  } catch (e) {
    console.error('Error in /api/shift-assignments DELETE:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to manage leaves
app.get('/api/leaves', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [leaves] = await connection.query(`
      SELECT l.*, u.name as user_name
      FROM leaves l
      JOIN users u ON l.user_id = u.user_id
      ORDER BY l.requested_at DESC
    `);
    connection.release();
    res.json({ data: leaves });
  } catch (e) {
    console.error('Error in /api/leaves:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const { user_id, type, start_date, end_date, reason, hour_from = null, hour_to = null } = req.body;
    const connection = await dbPool.getConnection();
    const days = calculateDays(start_date, end_date);
    await connection.query(
      "INSERT INTO leaves (user_id, type, start_date, end_date, days, reason, hour_from, hour_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, type, start_date, end_date, days, reason, hour_from, hour_to]
    );
    connection.release();
    res.json({ success: true, message: 'درخواست مرخصی با موفقیت ثبت شد' });
  } catch (e) {
    console.error('Error in /api/leaves POST:', e);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/leaves/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, manager_comment } = req.body;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "UPDATE leaves SET status = ?, manager_comment = ?, reviewed_at = NOW() WHERE id = ?",
      [status, manager_comment, id]
    );
    
    connection.release();
    res.json({ success: true, message: 'درخواست مرخصی بررسی شد' });
  } catch (e) {
    console.error('Error in /api/leaves review:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/leaves/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "DELETE FROM leaves WHERE id = ?",
      [id]
    );
    
    connection.release();
    res.json({ success: true, message: 'درخواست مرخصی با موفقیت حذف شد' });
  } catch (e) {
    console.error('Error in /api/leaves DELETE:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to manage notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const { user_id } = req.query;
    const connection = await dbPool.getConnection();
    
    let query = "SELECT * FROM notifications";
    let params = [];
    
    if (user_id) {
      query += " WHERE user_id = ? OR user_id IS NULL";
      params.push(user_id);
    }
    
    query += " ORDER BY created_at DESC";
    
    const [notifications] = await connection.query(query, params);
    connection.release();
    res.json({ data: notifications });
  } catch (e) {
    console.error('Error in /api/notifications:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
      [user_id || null, title, message, type || 'info']
    );
    
    connection.release();
    res.json({ success: true, message: 'اعلان با موفقیت ایجاد شد' });
  } catch (e) {
    console.error('Error in /api/notifications POST:', e);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ?",
      [id]
    );
    
    connection.release();
    res.json({ success: true });
  } catch (e) {
    console.error('Error in /api/notifications read:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "DELETE FROM notifications WHERE id = ?",
      [id]
    );
    
    connection.release();
    res.json({ success: true, message: 'اعلان با موفقیت حذف شد' });
  } catch (e) {
    console.error('Error in /api/notifications DELETE:', e);
    res.status(500).json({ error: e.message });
  }
});

// API to manage settings
app.get('/api/settings', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [settings] = await connection.query("SELECT * FROM settings ORDER BY setting_key");
    connection.release();
    res.json({ data: settings });
  } catch (e) {
    console.error('Error in /api/settings:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { setting_key, setting_value, description } = req.body;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      `INSERT INTO settings (setting_key, setting_value, description) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       setting_value = VALUES(setting_value), 
       description = VALUES(description)`,
      [setting_key, setting_value, description]
    );
    
    connection.release();
    res.json({ success: true, message: 'تنظیمات با موفقیت ذخیره شد' });
  } catch (e) {
    console.error('Error in /api/settings POST:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const connection = await dbPool.getConnection();
    
    await connection.query(
      "DELETE FROM settings WHERE setting_key = ?",
      [key]
    );
    
    connection.release();
    res.json({ success: true, message: 'تنظیمات با موفقیت حذف شد' });
  } catch (e) {
    console.error('Error in /api/settings DELETE:', e);
    res.status(500).json({ error: e.message });
  }
});

// API: ثبت ساعات اضافه‌کاری و کم‌کاری روزانه
app.post('/api/work-times', async (req, res) => {
  try {
    const { user_id, date, overtime_hours = 0, undertime_hours = 0, type = 'manual' } = req.body;
    if (!user_id || !date) {
      return res.status(400).json({ error: 'user_id و date الزامی است.' });
    }
    const connection = await dbPool.getConnection();
    await connection.query(
      `INSERT INTO work_times (user_id, date, overtime_hours, undertime_hours, type) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE overtime_hours = VALUES(overtime_hours), undertime_hours = VALUES(undertime_hours), type = VALUES(type)`,
      [user_id, date, overtime_hours, undertime_hours, type]
    );
    connection.release();
    res.json({ success: true, message: 'ساعات اضافه‌کاری/کم‌کاری ثبت شد.' });
  } catch (e) {
    console.error('Error in /api/work-times POST:', e);
    res.status(500).json({ error: e.message });
  }
});

// API: دریافت لیست اضافه‌کاری و کم‌کاری یک کاربر در یک ماه
app.get('/api/work-times', async (req, res) => {
  try {
    const { user_id, month, year } = req.query;
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'user_id، month و year الزامی است.' });
    }
    const connection = await dbPool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM work_times WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? ORDER BY date`,
      [user_id, month, year]
    );
    connection.release();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error in /api/work-times GET:', e);
    res.status(500).json({ error: e.message });
  }
});

// API جدید: دریافت لیست همه ثبت‌های اضافه‌کاری/کم‌کاری برای همه کاربران در یک ماه
app.get('/api/work-times/all', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }
    const connection = await dbPool.getConnection();
    const [rows] = await connection.query(
      `SELECT w.*, u.name as user_name FROM work_times w JOIN users u ON w.user_id = u.user_id WHERE MONTH(w.date) = ? AND YEAR(w.date) = ? ORDER BY w.date DESC`,
      [month, year]
    );
    connection.release();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error in /api/work-times/all GET:', e);
    res.status(500).json({ error: e.message });
  }
});

// API: محاسبه و ثبت حقوق ماهانه کاربر (حرفه‌ای با مالیات، پاداش، کسورات)
app.post('/api/calculate-salary', async (req, res) => {
  try {
    const { user_id, month, year, tax = 0, bonus = 0, deductions = 0 } = req.body; // دریافت مقادیر جدید
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'user_id، month و year الزامی است.' });
    }
    const connection = await dbPool.getConnection();
    // دریافت حقوق پایه
    const [[user]] = await connection.query('SELECT salary AS base_salary FROM users WHERE user_id = ?', [user_id]);
    if (!user) {
      connection.release();
      return res.status(404).json({ error: 'کاربر یافت نشد.' });
    }
    const base_salary = Number(user.base_salary) || 0;
    // مجموع ساعات اضافه‌کاری و کم‌کاری
    const [[work]] = await connection.query(
      `SELECT SUM(overtime_hours) AS total_overtime, SUM(undertime_hours) AS total_undertime FROM work_times WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
      [user_id, month, year]
    );
    const total_overtime = Number(work.total_overtime) || 0;
    const total_undertime = Number(work.total_undertime) || 0;
    // نرخ ساعتی
    const total_working_hours = 22 * 8; // فرض: ۲۲ روز کاری × ۸ ساعت
    const hourly_rate = total_working_hours > 0 ? base_salary / total_working_hours : 0;
    // نرخ‌ها
    const overtime_rate = 1.5;
    const undertime_rate = 1.0;
    // محاسبه حقوق نهایی با استاندارد جدید
    const total_salary = Math.round((base_salary + (total_overtime * hourly_rate * overtime_rate) - (total_undertime * hourly_rate * undertime_rate) - tax + bonus - deductions)*100)/100;
    // جلوگیری از NaN
    const safe = v => (isNaN(v) ? 0 : v);
    // ذخیره در جدول salaries با فیلدهای جدید
    await connection.query(
      `INSERT INTO salaries (user_id, base_salary, month, year, total_overtime_hours, total_undertime_hours, overtime_rate, undertime_rate, total_salary, tax, bonus, deductions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
       ON DUPLICATE KEY UPDATE total_overtime_hours = VALUES(total_overtime_hours), total_undertime_hours = VALUES(total_undertime_hours), total_salary = VALUES(total_salary), tax = VALUES(tax), bonus = VALUES(bonus), deductions = VALUES(deductions)`,
      [user_id, safe(base_salary), month, year, safe(total_overtime), safe(total_undertime), safe(overtime_rate), safe(undertime_rate), safe(total_salary), safe(tax), safe(bonus), safe(deductions)]
    );
    connection.release();
    res.json({
      success: true,
      message: 'حقوق ماهانه محاسبه و ثبت شد.',
      data: {
        user_id,
        base_salary,
        month,
        year,
        total_overtime,
        total_undertime,
        hourly_rate,
        overtime_rate,
        undertime_rate,
        total_salary,
        tax,
        bonus,
        deductions,
        status: 'pending',
        currency: 'افغانی'
      }
    });
  } catch (e) {
    console.error('Error in /api/calculate-salary POST:', e);
    res.status(500).json({ error: e.message });
  }
});

// API: دریافت لیست حقوق و دستمزد کاربران (ماهانه) با فیلدهای جدید
app.get('/api/salaries', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }
    const connection = await dbPool.getConnection();
    // نمایش همه کاربران حتی اگر حقوق ثبت نشده باشد
    const [rows] = await connection.query(
      `SELECT u.user_id, u.name, s.id as salary_id, s.base_salary, s.total_salary, s.total_overtime_hours, s.total_undertime_hours, s.tax, s.bonus, s.deductions, s.payment_date, s.status
       FROM users u
       LEFT JOIN salaries s ON u.user_id = s.user_id AND s.month = ? AND s.year = ?
       ORDER BY s.total_salary DESC, u.name ASC`,
      [month, year]
    );
    connection.release();
    res.json({ data: rows, currency: 'افغانی' });
  } catch (e) {
    console.error('Error in /api/salaries GET:', e);
    res.status(500).json({ error: e.message });
  }
});

// API جدید: محاسبه حقوق همه کاربران برای یک ماه و سال خاص
app.post('/api/calculate-salary/all', async (req, res) => {
  try {
    const { month, year, tax = 0, bonus = 0, deductions = 0 } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }
    const connection = await dbPool.getConnection();
    // دریافت همه کاربران فعال
    const [users] = await connection.query('SELECT user_id, salary FROM users');
    let results = [];
    const safe = v => (isNaN(v) ? 0 : v);
    for (const user of users) {
      const user_id = user.user_id;
      const base_salary = Number(user.salary) || 0;
      // مجموع ساعات اضافه‌کاری و کم‌کاری
      const [[work]] = await connection.query(
        `SELECT SUM(overtime_hours) AS total_overtime, SUM(undertime_hours) AS total_undertime FROM work_times WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
        [user_id, month, year]
      );
      const total_overtime = Number(work.total_overtime) || 0;
      const total_undertime = Number(work.total_undertime) || 0;
      // نرخ ساعتی
      const total_working_hours = 22 * 8; // قابل تنظیم از تنظیمات در آینده
      const hourly_rate = total_working_hours > 0 ? base_salary / total_working_hours : 0;
      // نرخ‌ها
      const overtime_rate = 1.5;
      const undertime_rate = 1.0;
      // محاسبه حقوق نهایی
      const total_salary = Math.round((base_salary + (total_overtime * hourly_rate * overtime_rate) - (total_undertime * hourly_rate * undertime_rate) - tax + bonus - deductions)*100)/100;
      // ذخیره در جدول salaries
      await connection.query(
        `INSERT INTO salaries (user_id, base_salary, month, year, total_overtime_hours, total_undertime_hours, overtime_rate, undertime_rate, total_salary, tax, bonus, deductions, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
         ON DUPLICATE KEY UPDATE total_overtime_hours = VALUES(total_overtime_hours), total_undertime_hours = VALUES(total_undertime_hours), total_salary = VALUES(total_salary), tax = VALUES(tax), bonus = VALUES(bonus), deductions = VALUES(deductions)`,
        [user_id, safe(base_salary), month, year, safe(total_overtime), safe(total_undertime), safe(overtime_rate), safe(undertime_rate), safe(total_salary), safe(tax), safe(bonus), safe(deductions)]
      );
      results.push({ user_id, base_salary, total_overtime, total_undertime, total_salary });
    }
    connection.release();
    res.json({ success: true, message: 'حقوق همه کاربران محاسبه و ثبت شد.', data: results });
  } catch (e) {
    console.error('Error in /api/calculate-salary/all POST:', e);
    res.status(500).json({ error: e.message });
  }
});

// API جدید: تغییر وضعیت پرداخت و ثبت پاداش/کسورات/مالیات
app.put('/api/salaries/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_date = null, status = 'paid', bonus = 0, deductions = 0, tax = 0 } = req.body;
    const connection = await dbPool.getConnection();
    await connection.query(
      `UPDATE salaries SET payment_date = ?, status = ?, bonus = ?, deductions = ?, tax = ? WHERE id = ?`,
      [payment_date, status, bonus, deductions, tax, id]
    );
    connection.release();
    res.json({ success: true, message: 'وضعیت پرداخت حقوق به‌روزرسانی شد.' });
  } catch (e) {
    console.error('Error in /api/salaries/:id/pay PUT:', e);
    res.status(500).json({ error: e.message });
  }
});

// API جدید: دریافت لیست کامل کاربران برای فرم‌ها و انتخاب‌ها
app.get('/api/users', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [users] = await connection.query("SELECT user_id AS userId, name, email, department, shift, hire_date FROM users ORDER BY name");
    connection.release();
    res.json({ data: users });
  } catch (e) {
    console.error('Error in /api/users:', e);
    res.status(500).json({ error: e.message });
  }
});

// API جدید: دریافت اطلاعات یک کاربر خاص
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    const connection = await dbPool.getConnection();
    // Query improved to handle extra spaces and hidden null characters
    const query = `
      SELECT user_id AS userId, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date 
      FROM users 
      WHERE TRIM(REPLACE(user_id, '\\0', '')) = TRIM(REPLACE(?, '\\0', ''))
    `;
    const [[user]] = await connection.query(query, [id]);
    connection.release();
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (e) {
    console.error(`Error in /api/users/${req.params.id}:`, e);
    res.status(500).json({ error: e.message });
  }
});

// API: دریافت ضرایب حقوق
app.get('/api/salary-coefficients', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [rows] = await connection.query(
      `SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('coef_overtime','coef_undertime','coef_tax','coef_bonus')`
    );
    connection.release();
    const result = {};
    rows.forEach(r => { result[r.setting_key] = r.setting_value; });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: ذخیره ضرایب حقوق
app.post('/api/salary-coefficients', async (req, res) => {
  try {
    const { coef_overtime, coef_undertime, coef_tax, coef_bonus } = req.body;
    const connection = await dbPool.getConnection();
    await connection.query(
      `INSERT INTO settings (setting_key, setting_value) VALUES ('coef_overtime', ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [coef_overtime]
    );
    await connection.query(
      `INSERT INTO settings (setting_key, setting_value) VALUES ('coef_undertime', ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [coef_undertime]
    );
    await connection.query(
      `INSERT INTO settings (setting_key, setting_value) VALUES ('coef_tax', ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [coef_tax]
    );
    await connection.query(
      `INSERT INTO settings (setting_key, setting_value) VALUES ('coef_bonus', ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [coef_bonus]
    );
    connection.release();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint برای همگام‌سازی صف کاربران معوق با دستگاه حضور و غیاب
app.post('/api/sync-pending-device-users', async (req, res) => {
    const connection = await dbPool.getConnection();
    const [pendingUsers] = await connection.query('SELECT * FROM pending_device_users');
    if (pendingUsers.length === 0) {
        connection.release();
        return res.json({ success: true, message: 'هیچ کاربر معوقی برای همگام‌سازی وجود ندارد.' });
    }
    let synced = 0;
    let failed = 0;
    let errors = [];
    try {
        const zk = await createZKConnection(10000);
        await zk.createSocket();
        for (const user of pendingUsers) {
            try {
                await zk.setUser(parseInt(user.user_id, 10), user.user_id, user.name, user.password || '', user.role, user.cardno);
                // اگر موفق بود، از جدول حذف کن
                await connection.query('DELETE FROM pending_device_users WHERE id = ?', [user.id]);
                synced++;
            } catch (err) {
                failed++;
                errors.push({ user_id: user.user_id, error: err.message });
            }
        }
        await zk.disconnect();
    } catch (e) {
        connection.release();
        return res.status(500).json({ success: false, message: 'خطا در اتصال به دستگاه حضور و غیاب', error: e.message });
    }
    connection.release();
    res.json({ success: true, synced, failed, errors });
});

// Endpoint جدید برای همگام‌سازی کامل کاربران بین دستگاه و دیتابیس
app.post('/api/sync-users-full', async (req, res) => {
    const connection = await dbPool.getConnection();
    let added = 0;
    let failed = 0;
    let errors = [];
    try {
        // 1. دریافت لیست کاربران دستگاه
        const zk = await createZKConnection(10000);
        await zk.createSocket();
        const deviceUsersResponse = await zk.getUsers();
        await zk.disconnect();
        const deviceUsers = deviceUsersResponse.data || deviceUsersResponse;
        // 2. دریافت لیست کاربران دیتابیس
        const [dbUsers] = await connection.query('SELECT user_id FROM users');
        const dbUserIds = new Set(dbUsers.map(u => u.user_id));
        // 3. افزودن کاربران جدید دستگاه به دیتابیس
        for (const user of deviceUsers) {
            if (!dbUserIds.has(user.userId)) {
                try {
                    await connection.query(
                        `INSERT INTO users (user_id, name, password, role, cardno) VALUES (?, ?, '', ?, ?)`
                        , [user.userId, user.name || '', user.role || 0, user.cardno || '0']
                    );
                    added++;
                } catch (err) {
                    failed++;
                    errors.push({ user_id: user.userId, error: err.message });
                }
            }
        }
        connection.release();
        res.json({ success: true, added, failed, errors });
    } catch (e) {
        connection.release();
        res.status(500).json({ success: false, message: 'خطا در همگام‌سازی کاربران دستگاه با دیتابیس', error: e.message });
    }
});

// Endpoint برای گزارش تعداد کاربران معوق
app.get('/api/pending-users-count', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM pending_device_users');
    connection.release();
    res.json({ count: rows[0].count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Device Management APIs ---

// Get all devices
app.get('/api/devices', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [devices] = await connection.query("SELECT * FROM devices ORDER BY name");
    connection.release();
    res.json({ data: devices });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add a new device
app.post('/api/devices', async (req, res) => {
  try {
    const { name, ip_address, location, serial_number } = req.body;
    const connection = await dbPool.getConnection();
    await connection.query(
      "INSERT INTO devices (name, ip_address, location, serial_number) VALUES (?, ?, ?, ?)",
      [name, ip_address, location, serial_number]
    );
    connection.release();
    res.json({ success: true, message: 'دستگاه با موفقیت اضافه شد.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a device
app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ip_address, location, serial_number } = req.body;
    const connection = await dbPool.getConnection();
    await connection.query(
      "UPDATE devices SET name=?, ip_address=?, location=?, serial_number=? WHERE id=?",
      [name, ip_address, location, serial_number, id]
    );
    connection.release();
    res.json({ success: true, message: 'دستگاه ویرایش شد.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete a device
app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbPool.getConnection();
    await connection.query("DELETE FROM devices WHERE id=?", [id]);
    connection.release();
    res.json({ success: true, message: 'دستگاه حذف شد.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/api/shifts', shiftRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/worktime', workTimeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ثبت کاربر در چند دستگاه و ذخیره device_user_id
app.post('/api/users', async (req, res) => {
  const { name, password, role = 0, user_type = 'personnel', device_ids, ...otherFields } = req.body;
  if (!name || !device_ids || !Array.isArray(device_ids) || device_ids.length === 0) {
    return res.status(400).json({ error: 'نام و حداقل یک دستگاه الزامی است.' });
  }
  const deviceUserIds = {};
  for (const deviceId of device_ids) {
    // دریافت اطلاعات دستگاه
    const connection = await dbPool.getConnection();
    const [[device]] = await connection.query("SELECT * FROM devices WHERE id=?", [deviceId]);
    connection.release();
    if (!device) continue;
    // ثبت کاربر در دستگاه
    const zk = new ZKJUBAER(device.ip_address, 4370, 10000, 5200);
    try {
      await zk.createSocket();
      // تولید شناسه یکتا برای دستگاه (مثلاً max+1)
      let deviceUserId = 1;
      try {
        const usersResp = await zk.getUsers();
        const deviceUsers = usersResp.data || usersResp;
        const usedUids = deviceUsers.map(u => u.uid || parseInt((u.userId + '').replace(/\D/g, ''), 10)).filter(x => !isNaN(x));
        deviceUserId = Math.max(...usedUids, 0) + 1;
      } catch (e) { deviceUserId = 1; }
      await zk.setUser(deviceUserId, String(deviceUserId), name, password || '', role, String(deviceUserId));
      deviceUserIds[deviceId] = deviceUserId;
      await zk.disconnect();
    } catch (e) {
      // مدیریت خطا
      deviceUserIds[deviceId] = null;
    }
  }
  // ذخیره کاربر در دیتابیس با deviceUserIds (به صورت JSON)
  const connection = await dbPool.getConnection();
  await connection.query(
    `INSERT INTO users (name, password, role, user_type, device_user_id, device_id${Object.keys(otherFields).length ? ', ' + Object.keys(otherFields).join(', ') : ''}) VALUES (?, ?, ?, ?, ?, ?${Object.keys(otherFields).length ? ', ' + Object.keys(otherFields).map(_ => '?').join(', ') : ''})`,
    [name, password, role, user_type, JSON.stringify(deviceUserIds), device_ids[0], ...Object.values(otherFields)]
  );
  connection.release();
  res.json({ success: true, deviceUserIds });
});

// ثبت حضور و غیاب با device_id و device_user_id
app.post('/api/attendances', async (req, res) => {
  const { user_id, device_id, device_user_id, timestamp, type } = req.body;
  if (!user_id || !device_id || !device_user_id || !timestamp || !type) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی است.' });
  }
  try {
    const connection = await dbPool.getConnection();
    await connection.query(
      `INSERT INTO attendances (user_id, device_id, device_user_id, timestamp, type) VALUES (?, ?, ?, ?, ?)`,
      [user_id, device_id, device_user_id, timestamp, type]
    );
    connection.release();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// دریافت لیست حضور و غیاب با نام دستگاه و کاربر
app.get('/api/attendances', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [rows] = await connection.query(`
      SELECT a.id, a.timestamp, a.type, a.device_user_id, u.name as user_name, d.name as device_name, d.location
      FROM attendances a
      JOIN users u ON a.user_id = u.user_id
      JOIN devices d ON a.device_id = d.id
      ORDER BY a.timestamp DESC
    `);
    connection.release();
    res.json({ data: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Calendar Events API ---
app.get('/api/calendar-events', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    // تعطیلات (settings)
    const [settings] = await connection.query("SELECT * FROM settings WHERE setting_key LIKE 'holiday_%'");
    // مرخصی‌ها (leaves)
    const [leaves] = await connection.query("SELECT l.*, u.name FROM leaves l LEFT JOIN users u ON l.user_id = u.user_id");
    // شیفت‌ها (shift_assignments)
    const [shifts] = await connection.query(`
      SELECT sa.*, s.name AS shift_name, s.start_time, s.end_time, u.name AS user_name
      FROM shift_assignments sa
      LEFT JOIN shifts s ON sa.shift_id = s.id
      LEFT JOIN users u ON sa.user_id = u.user_id
      WHERE sa.is_active = 1
    `);
    // حضور و غیاب (attendances)
    const [attendances] = await connection.query(`
      SELECT a.*, u.name FROM attendances a LEFT JOIN users u ON a.user_id = u.user_id
    `);
    // رویدادهای تقویم سفارشی (calendar_events)
    const [customEvents] = await connection.query(`
      SELECT ce.*, u.name as created_by_name FROM calendar_events ce LEFT JOIN users u ON ce.created_by = u.user_id
    `);
    connection.release();
    // تعطیلات
    const holidayEvents = settings.map(s => ({
      id: `holiday_${s.setting_key}`,
      title: s.setting_value,
      start: s.setting_key.replace('holiday_', ''),
      allDay: true,
      type: 'holiday',
      backgroundColor: '#ffb347',
      borderColor: '#ffb347',
    }));
    // مرخصی‌ها
    const leaveEvents = leaves.map(l => ({
      id: `leave_${l.id}`,
      title: `مرخصی ${l.name || ''}`,
      start: l.start_date,
      end: l.end_date ? new Date(new Date(l.end_date).getTime() + 24*60*60*1000).toISOString().slice(0,10) : l.start_date,
      allDay: true,
      type: 'leave',
      backgroundColor: '#6bd098',
      borderColor: '#6bd098',
    }));
    // شیفت‌ها
    const shiftEvents = shifts.map(s => ({
      id: `shift_${s.id}`,
      title: `شیفت ${s.user_name || ''}: ${s.shift_name || ''}`,
      start: s.start_date,
      end: s.end_date ? new Date(new Date(s.end_date).getTime() + 24*60*60*1000).toISOString().slice(0,10) : s.start_date,
      allDay: true,
      type: 'shift',
      backgroundColor: '#5e72e4',
      borderColor: '#5e72e4',
    }));
    // حضور و غیاب (هر روز فقط یک event برای هر کاربر)
    const attendanceMap = {};
    attendances.forEach(a => {
      const day = a.timestamp.toISOString().slice(0,10);
      const key = `${a.user_id}_${day}`;
      if (!attendanceMap[key]) {
        attendanceMap[key] = { user: a.name, user_id: a.user_id, day, count: 0 };
      }
      attendanceMap[key].count++;
    });
    const attendanceEvents = Object.values(attendanceMap).map(a => ({
      id: `attendance_${a.user_id}_${a.day}`,
      title: `حضور ${a.user} (${a.count} ثبت)`,
      start: a.day,
      allDay: true,
      type: 'attendance',
      backgroundColor: '#f5365c',
      borderColor: '#f5365c',
    }));
    // رویدادهای سفارشی
    const customCalendarEvents = customEvents.map(ce => ({
      id: `custom_${ce.id}`,
      title: ce.title,
      description: ce.description,
      start: ce.start_time ? `${ce.start_date}T${ce.start_time}` : ce.start_date,
      end: ce.end_date ? (ce.end_time ? `${ce.end_date}T${ce.end_time}` : ce.end_date) : null,
      allDay: ce.all_day === 1,
      type: 'custom',
      backgroundColor: ce.color,
      borderColor: ce.color,
      created_by: ce.created_by_name,
    }));
    res.json({ events: [...holidayEvents, ...leaveEvents, ...shiftEvents, ...attendanceEvents, ...customCalendarEvents] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API برای ایجاد رویداد جدید
app.post('/api/calendar-events', async (req, res) => {
  try {
    const { title, description, start_date, start_time, end_date, end_time, all_day, color, created_by } = req.body;
    
    if (!title || !start_date) {
      return res.status(400).json({ error: 'عنوان و تاریخ شروع الزامی است' });
    }
    
    const connection = await dbPool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO calendar_events (title, description, start_date, start_time, end_date, end_time, all_day, color, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, start_date, start_time || null, end_date || null, end_time || null, all_day ? 1 : 0, color || '#5e72e4', created_by || null]
    );
    connection.release();
    
    res.json({ 
      success: true, 
      message: 'رویداد با موفقیت ایجاد شد',
      event_id: result.insertId 
    });
  } catch (e) {
    console.error('Error in /api/calendar-events POST:', e);
    res.status(500).json({ error: e.message });
  }
});

// API برای به‌روزرسانی رویداد
app.put('/api/calendar-events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, start_time, end_date, end_time, all_day, color } = req.body;
    
    if (!title || !start_date) {
      return res.status(400).json({ error: 'عنوان و تاریخ شروع الزامی است' });
    }
    
    const connection = await dbPool.getConnection();
    await connection.query(
      `UPDATE calendar_events 
       SET title = ?, description = ?, start_date = ?, start_time = ?, end_date = ?, end_time = ?, all_day = ?, color = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, start_date, start_time || null, end_date || null, end_time || null, all_day ? 1 : 0, color || '#5e72e4', id]
    );
    connection.release();
    
    res.json({ success: true, message: 'رویداد با موفقیت به‌روزرسانی شد' });
  } catch (e) {
    console.error('Error in /api/calendar-events PUT:', e);
    res.status(500).json({ error: e.message });
  }
});

// API برای حذف رویداد
app.delete('/api/calendar-events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    await connection.query('DELETE FROM calendar_events WHERE id = ?', [id]);
    connection.release();
    
    res.json({ success: true, message: 'رویداد با موفقیت حذف شد' });
  } catch (e) {
    console.error('Error in /api/calendar-events DELETE:', e);
    res.status(500).json({ error: e.message });
  }
});

// API ساده برای محاسبه خودکار ساعات کار
app.post('/api/calculate-work-times', async (req, res) => {
  try {
    const { user_id, month, year } = req.body;
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'user_id، month و year الزامی است.' });
    }

    const workTimeModel = require('./models/workTimeModel');
    const daysInMonth = new Date(year, month, 0).getDate();
    let totalOvertime = 0;
    let totalUndertime = 0;

    // محاسبه برای تمام روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const { overtime, undertime } = await workTimeModel.calculateFromAttendance(user_id, date);
      
      // ذخیره در جدول work_times
      await workTimeModel.createOrUpdateWorkTime({
        user_id,
        date,
        overtime_hours: overtime,
        undertime_hours: undertime,
        type: 'auto'
      });

      totalOvertime += overtime;
      totalUndertime += undertime;
    }
    
    res.json({ 
      success: true, 
      message: 'ساعات کار محاسبه و ثبت شد.',
      data: { totalOvertime, totalUndertime }
    });
  } catch (e) {
    console.error('Error in /api/calculate-work-times:', e);
    res.status(500).json({ error: e.message });
  }
});

// API ساده برای محاسبه خودکار ساعات کار همه کاربران
app.post('/api/calculate-work-times/all', async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }

    const connection = await dbPool.getConnection();
    const [users] = await connection.query('SELECT user_id FROM users');
    connection.release();

    const workTimeModel = require('./models/workTimeModel');
    let results = [];
    let errors = [];

    for (const user of users) {
      try {
        const daysInMonth = new Date(year, month, 0).getDate();
        let totalOvertime = 0;
        let totalUndertime = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const { overtime, undertime } = await workTimeModel.calculateFromAttendance(user.user_id, date);
          
          await workTimeModel.createOrUpdateWorkTime({
            user_id: user.user_id,
            date,
            overtime_hours: overtime,
            undertime_hours: undertime,
            type: 'auto'
          });

          totalOvertime += overtime;
          totalUndertime += undertime;
        }

        results.push({ user_id: user.user_id, totalOvertime, totalUndertime });
      } catch (error) {
        errors.push(`کاربر ${user.user_id}: ${error.message}`);
      }
    }

    res.json({ 
      success: true, 
      message: 'ساعات کار همه کاربران محاسبه شد.',
      data: { results, errors, totalProcessed: results.length, totalErrors: errors.length }
    });
  } catch (e) {
    console.error('Error in /api/calculate-work-times/all:', e);
    res.status(500).json({ error: e.message });
  }
});

// API محاسبه حقوق برای یک کاربر
app.post('/api/salaries/calculate', async (req, res) => {
  try {
    const { user_id, month, year } = req.body;
    if (!user_id || !month || !year) {
      return res.status(400).json({ error: 'user_id، month و year الزامی است.' });
    }

    const salaryModel = require('./models/salaryModel');
    const result = await salaryModel.calculateSalary({ user_id, month, year });
    
    if (result) {
      res.json({ success: true, message: 'حقوق محاسبه شد', data: result });
    } else {
      res.status(404).json({ success: false, error: 'کاربر یافت نشد' });
    }
  } catch (e) {
    console.error('Error in /api/salaries/calculate:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// API محاسبه حقوق برای همه کاربران
app.post('/api/salaries/calculate-all', async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }

    const salaryModel = require('./models/salaryModel');
    const result = await salaryModel.calculateAllSalaries({ month, year });
    
    res.json({ 
      success: true, 
      message: `حقوق ${result.totalProcessed} کاربر محاسبه شد.`,
      totalProcessed: result.totalProcessed,
      totalErrors: result.totalErrors,
      errors: result.errors
    });
  } catch (e) {
    console.error('Error in /api/salaries/calculate-all:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// API دریافت لیست حقوق
app.get('/api/salaries', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }

    const salaryModel = require('./models/salaryModel');
    const data = await salaryModel.getSalaries(month, year);
    res.json({ data });
  } catch (e) {
    console.error('Error in /api/salaries GET:', e);
    res.status(500).json({ error: e.message });
  }
});

// API تغییر وضعیت پرداخت حقوق
app.put('/api/salaries/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_date = null, status = 'paid', bonus = 0, deductions = 0, tax = 0 } = req.body;
    
    const salaryModel = require('./models/salaryModel');
    await salaryModel.paySalary({ id, payment_date, status, bonus, deductions, tax });
    
    res.json({ success: true, message: 'وضعیت پرداخت به‌روزرسانی شد.' });
  } catch (e) {
    console.error('Error in /api/salaries/:id/pay:', e);
    res.status(500).json({ error: e.message });
  }
});

// API تست برای بررسی عملکرد
app.get('/api/test-salary', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    
    // تست 1: بررسی اتصال دیتابیس
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    // تست 2: بررسی جدول salaries
    const [salaries] = await connection.query('SELECT COUNT(*) as count FROM salaries');
    
    // تست 3: بررسی جدول work_times
    const [workTimes] = await connection.query('SELECT COUNT(*) as count FROM work_times');
    
    // تست 4: بررسی تنظیمات
    const [settings] = await connection.query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('coef_overtime', 'coef_undertime')");
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        users_count: users[0].count,
        salaries_count: salaries[0].count,
        work_times_count: workTimes[0].count,
        settings: settings
      }
    });
  } catch (e) {
    console.error('Error in test API:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// API خروجی اکسل حقوق
app.get('/api/salaries/export', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month و year الزامی است.' });
    }

    const salaryModel = require('./models/salaryModel');
    const salaries = await salaryModel.getSalaries(month, year);
    
    // ایجاد فایل اکسل
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('حقوق و دستمزد');
    
    // تنظیم ستون‌ها
    worksheet.columns = [
      { header: 'نام کارمند', key: 'name', width: 20 },
      { header: 'شماره کارمندی', key: 'user_id', width: 15 },
      { header: 'حقوق پایه', key: 'base_salary', width: 15 },
      { header: 'ساعات اضافه‌کاری', key: 'total_overtime_hours', width: 15 },
      { header: 'ساعات کم‌کاری', key: 'total_undertime_hours', width: 15 },
      { header: 'حقوق نهایی', key: 'total_salary', width: 15 },
      { header: 'وضعیت', key: 'status', width: 15 },
      { header: 'تاریخ پرداخت', key: 'payment_date', width: 15 }
    ];

    // اضافه کردن داده‌ها
    salaries.forEach(salary => {
      worksheet.addRow({
        name: salary.name || 'نامشخص',
        user_id: salary.user_id,
        base_salary: salary.base_salary || 0,
        total_overtime_hours: salary.total_overtime_hours || 0,
        total_undertime_hours: salary.total_undertime_hours || 0,
        total_salary: salary.total_salary || 0,
        status: salary.status === 'paid' ? 'پرداخت شده' : 'در انتظار',
        payment_date: salary.payment_date || '-'
      });
    });

    // تنظیم هدر
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=salaries-${year}-${month}.xlsx`);

    // ارسال فایل
    await workbook.xlsx.write(res);
    res.end();
  } catch (e) {
    console.error('Error exporting salaries:', e);
    res.status(500).json({ error: e.message });
  }
});

// API تست سیستم حقوق
app.get('/api/salaries/test', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    
    // بررسی تعداد کاربران
    const [[usersCount]] = await connection.query('SELECT COUNT(*) as count FROM users WHERE salary > 0');
    
    // بررسی تعداد حقوق ثبت شده
    const [[salariesCount]] = await connection.query('SELECT COUNT(*) as count FROM salaries');
    
    // بررسی تعداد ساعات کار
    const [[workTimesCount]] = await connection.query('SELECT COUNT(*) as count FROM attendances');
    
    // بررسی تنظیمات سیستم
    const [settings] = await connection.query(`
      SELECT setting_key, setting_value 
      FROM settings 
      WHERE setting_key IN ('coef_overtime', 'coef_undertime', 'coef_tax', 'coef_bonus', 'monthly_work_hours')
    `);
    
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    connection.release();

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
});

// API ثبت اضافه‌کاری دستی
app.post('/api/overtime/manual', async (req, res) => {
  const { user_id, date, overtime_hours } = req.body;
  if (!user_id || !date) return res.status(400).json({ error: 'user_id و date الزامی است.' });
  try {
    const connection = await dbPool.getConnection();
    await connection.query(
      `INSERT INTO work_times (user_id, date, overtime_hours, type)
       VALUES (?, ?, ?, 'manual')
       ON DUPLICATE KEY UPDATE overtime_hours = VALUES(overtime_hours), type = 'manual'`,
      [user_id, date, overtime_hours]
    );
    connection.release();
    res.json({ success: true, message: 'اضافه‌کاری ثبت شد.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});