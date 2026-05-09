const multer = require('multer');
const path = require('path');
const fs = require('fs');

// สร้าง folder ถ้ายังไม่มี
const uploadDir = 'public/uploads/employees';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Config Multer สำหรับ Employee Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ⭐ ใช้ emp_code เป็นชื่อไฟล์
    const empCode = req.body.emp_code?.slice(0,5) || req.body.base_emp_code || 'employee';
    const ext = path.extname(file.originalname);
    cb(null, `${empCode}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

const uploadEmployee = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = uploadEmployee;
