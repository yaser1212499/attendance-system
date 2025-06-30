const express = require('express');
const cors = require('cors');
const path = require('path');

// Import configurations and services
const { dbPool, testConnection } = require('./config/database');
const deviceConfig = require('./config/device');
const payrollService = require('./services/payrollService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const personnelRoutes = require('./routes/personnelRoutes');
const syncRoutes = require('./routes/syncRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const shiftAssignmentRoutes = require('./routes/shiftAssignmentRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingRoutes = require('./routes/settingRoutes');
const workTimeRoutes = require('./routes/workTimeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'assets')));

// Database initialization function
async function initDatabase() {
  try {
    // Import models
    const { createAttendanceTable } = require('./models/attendanceModel');
    const { createUserTable } = require('./models/userModel');
    const { createPersonnelTable } = require('./models/personnelModel');
    const { createShiftTable } = require('./models/shiftModel');
    const { createShiftAssignmentTable } = require('./models/shiftAssignmentModel');
    const { createLeaveTable } = require('./models/leaveModel');
    const { createNotificationTable } = require('./models/notificationModel');
    const { createSettingTable } = require('./models/settingModel');
    const { createWorkTimeTable } = require('./models/workTimeModel');
    const { createSalaryTable } = require('./models/salaryModel');
    
    // Create tables if they don't exist
    await createAttendanceTable();
    await createUserTable();
    await createPersonnelTable();
    await createShiftTable();
    await createShiftAssignmentTable();
    await createLeaveTable();
    await createNotificationTable();
    await createSettingTable();
    await createWorkTimeTable();
    await createSalaryTable();
    const connection = await dbPool.getConnection();
    console.log('✅ Successfully connected to the MySQL database.');

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
    console.log('✅ `attendances` table is ready.');

    // Create users table
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
    console.log('✅ `users` table is ready.');

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
    console.log('✅ `shifts` table is ready.');

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
    console.log('✅ `shift_assignments` table is ready.');

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
    console.log('✅ `leaves` table is ready.');

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
    console.log('✅ `notifications` table is ready.');

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
    console.log('✅ `settings` table is ready.');

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
    console.log('✅ `work_times` table is ready.');

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
    console.log('✅ `salaries` table is ready.');

    connection.release();
  } catch (err) {
    console.error('❌ Database connection or table creation failed:', err);
    process.exit(1);
  }
}

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api', syncRoutes); // Routes for syncing with device
app.use('/api/shifts', shiftRoutes);
app.use('/api/shift-assignments', shiftAssignmentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/work-times', workTimeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/reports', reportRoutes);

// Public API endpoints (for backward compatibility)
app.get('/api/data', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const connection = await dbPool.getConnection();
    
    const [dbUsers] = await connection.query("SELECT user_id AS userId, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date FROM users");
    
    const [[{ total }]] = await connection.query("SELECT COUNT(*) as total FROM attendances");
    
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

app.get('/api/attendance', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const connection = await dbPool.getConnection();
    
    const [[{ total }]] = await connection.query("SELECT COUNT(*) as total FROM attendances");
    
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

// Dashboard statistics
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    
    const [[{ totalUsers }]] = await connection.query("SELECT COUNT(*) as totalUsers FROM users");
    
    const today = new Date().toISOString().split('T')[0];
    
    const [[{ todayCheckins }]] = await connection.query(
      "SELECT COUNT(*) as todayCheckins FROM attendances WHERE DATE(timestamp) = ? AND type = 'ورود'",
      [today]
    );
    
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

// Serve main dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'خطای داخلی سرور',
    message: process.env.NODE_ENV === 'development' ? err.message : 'خطا در پردازش درخواست'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'مسیر یافت نشد' });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Improved ZKTeco API server running on port ${PORT}`);
  
  // Initialize database
  await initDatabase();
  
  // Initialize device settings
  await deviceConfig.initializeDeviceSettings();
  
  // Initialize salary coefficients
  await payrollService.initializeSalaryCoefficients();
  
  console.log('✅ System initialization completed successfully');
  console.log('📝 To create an admin user, POST to /api/auth/create-admin');
  console.log('🔐 To login, POST to /api/auth/login');
});

module.exports = app;