const db = require('../config/db');

exports.getAllUsers = async () => {
  const [rows] = await db.query('SELECT user_id AS userId, name, email, department, shift, hire_date, salary FROM users ORDER BY name');
  return rows;
};

exports.getUserById = async (id) => {
  const query = `
    SELECT user_id AS userId, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date, position
    FROM users 
    WHERE TRIM(REPLACE(user_id, '\\0', '')) = TRIM(REPLACE(?, '\\0', ''))
  `;
  const [[user]] = await db.query(query, [id]);
  return user;
};

exports.createOrUpdateUser = async (user) => {
  try {
    console.log('--- [DEBUG] Start createOrUpdateUser ---');
    console.log('Received user object:', JSON.stringify(user, null, 2));
    const salary = user.salary ? parseFloat(user.salary) : null;
    console.log('Processed salary:', salary);
    const [result] = await db.query(
      `INSERT INTO users (user_id, name, password, role, cardno, province, district, salary, shift, department, phone, email, address, hire_date, position) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
       hire_date = VALUES(hire_date),
       position = VALUES(position)`
      , [user.userId, user.name, user.password || '', user.role || 0, user.cardno || '0', user.province, user.district, salary, user.shift, user.department, user.phone, user.email, user.address, user.hire_date, user.position || null]
    );
    console.log('DB result:', result);
    if (result.affectedRows === 1 && result.insertId) {
      console.log('User inserted:', user.userId);
    } else {
      console.log('User updated:', user.userId);
    }
    console.log('--- [DEBUG] End createOrUpdateUser ---');
  } catch (error) {
    console.error('Database error in createOrUpdateUser:', error);
    throw error;
  }
};

// تابع جدید برای به‌روزرسانی پروفایل
exports.updateProfile = async (userData) => {
  try {
    console.log('--- [DEBUG] Start updateProfile ---');
    console.log('Received profile data:', JSON.stringify(userData, null, 2));
    
    // بررسی وجود فیلدهای جدید در دیتابیس
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasPostalCode = columnNames.includes('postal_code');
    const hasAboutMe = columnNames.includes('about_me');
    
    // ساخت کوئری به‌روزرسانی
    let updateQuery = `
      UPDATE users SET 
        name = ?, 
        email = ?, 
        phone = ?, 
        address = ?, 
        province = ?, 
        district = ?
    `;
    
    let queryParams = [
      userData.name,
      userData.email,
      userData.phone,
      userData.address,
      userData.province,
      userData.district
    ];
    
    // اضافه کردن فیلدهای جدید اگر در دیتابیس وجود دارند
    if (hasPostalCode) {
      updateQuery += ', postal_code = ?';
      queryParams.push(userData.postal_code);
    }
    
    if (hasAboutMe) {
      updateQuery += ', about_me = ?';
      queryParams.push(userData.about_me);
    }
    
    updateQuery += ' WHERE user_id = ?';
    queryParams.push(userData.userId);
    
    console.log('Update query:', updateQuery);
    console.log('Query parameters:', queryParams);
    
    const [result] = await db.query(updateQuery, queryParams);
    
    console.log('Update result:', result);
    
    if (result.affectedRows === 0) {
      throw new Error('کاربر یافت نشد یا تغییری اعمال نشد');
    }
    
    console.log('Profile updated successfully for user:', userData.userId);
    console.log('--- [DEBUG] End updateProfile ---');
    
    return result;
    
  } catch (error) {
    console.error('Database error in updateProfile:', error);
    throw error;
  }
}; 