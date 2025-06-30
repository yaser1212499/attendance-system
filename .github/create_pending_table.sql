CREATE TABLE IF NOT EXISTS attendance_system4.pending_device_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 