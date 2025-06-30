const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; // بهتر است این مقدار را از env بخوانید

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ error: 'توکن احراز هویت ارسال نشده است.' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'توکن نامعتبر است.' });
    req.user = user;
    next();
  });
}; 