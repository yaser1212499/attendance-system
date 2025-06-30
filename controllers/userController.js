const userModel = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({ data: users });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    const user = await userModel.getUserById(id);
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createOrUpdateUser = async (req, res) => {
  try {
    const user = req.body;
    console.log('Received user data:', user);
    
    if (!user.name) {
      return res.status(400).json({ error: 'name is required.' });
    }
    if (user.salary !== undefined && (user.salary === null || user.salary === '' || parseFloat(user.salary) <= 0)) {
      return res.status(400).json({ error: 'حقوق پایه باید مقدار مثبت داشته باشد.' });
    }
    if (user.email && !/^\S+@\S+\.\S+$/.test(user.email)) {
      return res.status(400).json({ error: 'ایمیل وارد شده معتبر نیست.' });
    }
    if (user.phone && !/^[0-9\-+() ]{7,20}$/.test(user.phone)) {
      return res.status(400).json({ error: 'شماره تلفن وارد شده معتبر نیست.' });
    }
    // تولید خودکار شناسه اگر userId وجود نداشت
    if (!user.userId) {
      let prefix = user.role == 2 ? 'PERS' : 'USER';
      const [last] = await require('../config/db').query(`SELECT user_id FROM users WHERE user_id LIKE '${prefix}%' ORDER BY user_id DESC LIMIT 1`);
      let nextId;
      if (last.length === 0) {
        nextId = prefix + '001';
      } else {
        const lastId = last[0].user_id;
        const num = parseInt(lastId.replace(prefix, '')) + 1;
        nextId = prefix + num.toString().padStart(3, '0');
      }
      user.userId = nextId;
    }
    if (user.role == 2) {
      user.password = '';
    }
    await userModel.createOrUpdateUser(user);
    console.log('User saved successfully:', user.userId);
    res.json({ success: true, message: `کاربر/پرسنل با موفقیت ذخیره شد. شناسه: ${user.userId}`, userId: user.userId });
  } catch (e) {
    console.error('Error in createOrUpdateUser:', e);
    res.status(500).json({ error: e.message });
  }
};

// تابع جدید برای به‌روزرسانی پروفایل
exports.updateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    const userId = req.user?.userId || req.body.userId; // از توکن یا body بگیرد
    
    console.log('Received profile update data:', profileData);
    console.log('User ID:', userId);
    
    // اعتبارسنجی داده‌ها
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'شناسه کاربر الزامی است' 
      });
    }
    
    if (profileData.email && !/^\S+@\S+\.\S+$/.test(profileData.email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'ایمیل وارد شده معتبر نیست' 
      });
    }
    
    if (profileData.phone && !/^[0-9\-+() ]{7,20}$/.test(profileData.phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'شماره تلفن وارد شده معتبر نیست' 
      });
    }
    
    // بررسی وجود کاربر
    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        success: false, 
        error: 'کاربر یافت نشد' 
      });
    }
    
    // آماده‌سازی داده‌ها برای به‌روزرسانی
    const updateData = {
      userId: userId,
      name: profileData.firstName && profileData.lastName ? 
        `${profileData.firstName} ${profileData.lastName}` : 
        existingUser.name,
      email: profileData.email || existingUser.email,
      phone: profileData.phone || existingUser.phone,
      address: profileData.address || existingUser.address,
      province: profileData.city || existingUser.province,
      district: profileData.country || existingUser.district,
      // اضافه کردن فیلدهای جدید اگر در دیتابیس وجود دارند
      postal_code: profileData.postalCode,
      about_me: profileData.aboutMe,
      // حفظ سایر فیلدهای موجود
      password: existingUser.password,
      role: existingUser.role,
      cardno: existingUser.cardno,
      salary: existingUser.salary,
      shift: existingUser.shift,
      department: existingUser.department,
      hire_date: existingUser.hire_date,
      position: existingUser.position
    };
    
    // به‌روزرسانی در دیتابیس
    await userModel.updateProfile(updateData);
    
    console.log('Profile updated successfully for user:', userId);
    res.json({ 
      success: true, 
      message: 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد',
      data: {
        userId: updateData.userId,
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.province,
        country: updateData.district,
        postalCode: updateData.postal_code,
        aboutMe: updateData.about_me
      }
    });
    
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در به‌روزرسانی پروفایل: ' + error.message 
    });
  }
};

// تابع برای دریافت پروفایل کاربر
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.params.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'شناسه کاربر الزامی است' 
      });
    }
    
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'کاربر یافت نشد' 
      });
    }
    
    // تقسیم نام به نام و نام خانوادگی
    const nameParts = user.name ? user.name.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const profileData = {
      userId: user.userId,
      username: user.userId, // یا فیلد جداگانه username اگر دارید
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.province,
      country: user.district,
      postalCode: user.postal_code,
      aboutMe: user.about_me,
      department: user.department,
      position: user.position,
      hireDate: user.hire_date,
      role: user.role
    };
    
    res.json({ 
      success: true, 
      data: profileData 
    });
    
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت اطلاعات پروفایل: ' + error.message 
    });
  }
}; 