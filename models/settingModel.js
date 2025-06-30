const db = require('../config/db');

exports.getSetting = async (key) => {
  const [[row]] = await db.query('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
  return row ? row.setting_value : null;
};

exports.getAllSettings = async () => {
  const [rows] = await db.query('SELECT setting_key, setting_value FROM settings');
  const settings = {};
  for (const row of rows) {
    settings[row.setting_key] = row.setting_value;
  }
  return settings;
};

exports.updateSetting = async (key, value) => {
  await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
}; 