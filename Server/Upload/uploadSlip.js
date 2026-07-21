const multer = require('multer');
const path = require('path');
const fs = require('fs');

function pad(n) {
  return String(n).padStart(2, '0');
}

function getDateParts() {
  const d = new Date();
  return {
    yyyy: d.getFullYear(),
    mm: pad(d.getMonth() + 1),
    dd: pad(d.getDate()),
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { yyyy, mm, dd } = getDateParts();
    const rel = `${yyyy}/${mm}/${dd}`;
    const dir = `public/uploads/slips/${rel}`;
    fs.mkdirSync(dir, { recursive: true });
    req._slipDateRel = rel;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const bid = req.body.booking_id || 'slip';
    const ext = path.extname(file.originalname);
    const rel = req._slipDateRel;
    const dir = `public/uploads/slips/${rel}`;
    let name = `${bid}${ext}`;
    let counter = 0;
    while (fs.existsSync(path.join(dir, name))) {
      counter++;
      name = `${bid}-${counter}${ext}`;
    }
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, pdf, webp)'));
  }
};

const uploadSlip = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

module.exports = uploadSlip;
