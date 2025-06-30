const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const JWT_SECRET = 'your_jwt_secret_key'; // بهتر است این مقدار را در env قرار دهید

exports.login = async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) {
    return res.status(400).json({ error: 'user_id و password الزامی است.' });
  }
  try {
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'کاربر یافت نشد.' });
    }
    const user = users[0];
    // اگر پرسنل غیرقابل لاگین است
    if (user.role == 2) {
      return res.status(403).json({ error: 'این پرسنل اجازه ورود به سیستم را ندارد.' });
    }
    // اگر رمز عبور هش شده است:
    const isMatch = await bcrypt.compare(password, user.password);
    // اگر رمز عبور ساده است:
    // const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({ error: 'رمز عبور اشتباه است.' });
    }
    const token = jwt.sign({ user_id: user.user_id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { user_id: user.user_id, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 