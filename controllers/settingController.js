const settingModel = require('../models/settingModel');

// دریافت همه تنظیمات
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await settingModel.getAllSettings();
    res.json({ data: settings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ویرایش یک تنظیم خاص
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    await settingModel.updateSetting(key, value);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 