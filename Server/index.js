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
app.use('/equipment',   require('./Routes/Equipment/route'));
app.use('/employee',    require('./Routes/Employee/route'));
app.use('/department',    require('./Routes/Department/route'));
app.use('/software',    require('./Routes/Software/route'));
app.use('/access',    require('./Routes/Access/route'));
app.use('/maintenance',    require('./Routes/Maintenance/route'));
app.use('/purchase',    require('./Routes/Purchase/route'));
app.use('/token',    require('./Routes/Token/route'));
app.use('/takeout',    require('./Routes/Takeout/route'));
app.use('/vendor',    require('./Routes/Vendor/route'));

// Global error handler (ต้องอยู่ท้ายสุดเสมอ)
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log(`✅ Running on port ${process.env.PORT || 5000}`)
);