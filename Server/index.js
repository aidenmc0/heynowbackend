const express = require('express');
const cors = require('cors');
const errorHandler = require('./Middlewares/errorHandler')

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files (สำหรับ uploaded images)
app.use(express.static('public'));

// Routes (Auth ไม่ต้องใส่ auth middleware ใน route level)
app.use('/auth',        require('./Routes/Auth/route'));
app.use('/employee',    require('./Routes/Employee/route'));
app.use('/department',    require('./Routes/Department/route'));

// Global error handler (ต้องอยู่ท้ายสุดเสมอ)
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log(`✅ Running on port ${process.env.PORT || 5000}`)
);