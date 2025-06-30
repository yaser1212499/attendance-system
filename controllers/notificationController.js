const notificationModel = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;
    const notifications = await notificationModel.getNotifications(user_id);
    res.json({ data: notifications });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    await notificationModel.createNotification({ user_id, title, message, type });
    res.json({ success: true, message: 'اعلان با موفقیت ایجاد شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.markAsRead(id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.deleteNotification(id);
    res.json({ success: true, message: 'اعلان با موفقیت حذف شد' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}; 