const mysql = require('mysql2/promise');
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'attendance_system4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = dbPool; 