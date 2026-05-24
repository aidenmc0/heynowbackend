const express = require('express');
const router = express.Router();
const supabase = require('../../db');
const bcrypt = require('bcryptjs'); 

// GET ALL
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emp_tbls')
      .select('*, dep_tbls(dep_full, dep_short)')
      .order('emp_code');
    if (error) throw error;

    // Flatten dep_tbls object เข้า employee
    const result = data.map(emp => ({
      ...emp,
      dep_full:  emp.dep_tbls?.dep_full,
      dep_short: emp.dep_tbls?.dep_short,
      dep_tbls:  undefined,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET BY ID
router.get('/:emp_code', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emp_tbls')
      .select('*, dep_tbls(dep_full, dep_short)')
      .eq('emp_code', req.params.emp_code)
      .single();
    if (error) throw error;

    const result = {
      ...data,
      dep_full:  data.dep_tbls?.dep_full,
      dep_short: data.dep_tbls?.dep_short,
      dep_tbls:  undefined,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST EMPLOYEE
router.post('/', async (req, res) => {
  try {
    // 👉 2. เพิ่ม emp_password เข้ามาใน req.body
    const { 
      emp_code, 
      emp_prefix, 
      emp_name, 
      emp_surname, 
      emp_position, 
      dep_code, 
      emp_type, 
      emp_tel, 
      emp_password, 
      deleteflag, 
      createdby 
    } = req.body;

    // ป้องกันกรณีไม่ส่งรหัสผ่านมา
    if (!emp_password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // 👉 3. Hash password ก่อนบันทึก (salt rounds = 10 เป็นค่ามาตรฐาน)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(emp_password, salt);

    // Insert ข้อมูลลง emp_tbls
    const { data, error } = await supabase
      .from('emp_tbls')
      .insert([{ 
        emp_code, 
        emp_prefix, 
        emp_name, 
        emp_surname, 
        emp_position, 
        dep_code, 
        emp_type, 
        emp_tel, 
        emp_password: hashedPassword, // 👉 4. ใช้รหัสผ่านที่ Hash แล้ว
        deleteflag, 
        createdby 
      }])
      .select('*, dep_tbls(dep_full, dep_short)') 
      .single();

    if (error) throw error;

    // Flatten dep_tbls object เข้า employee
    const result = {
      ...data,
      dep_full:  data.dep_tbls?.dep_full,
      dep_short: data.dep_tbls?.dep_short,
      dep_tbls:  undefined,
    };

    // 👉 5. (แนะนำ) ลบ password ออกจาก Response ที่ส่งกลับไป Frontend เพื่อความปลอดภัย
    delete result.emp_password;

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (UPDATE) EMPLOYEE
router.put('/:emp_code', async (req, res) => {
  try {
    const { emp_code: codeFromParam } = req.params;
    const { 
      emp_prefix, 
      emp_name, 
      emp_surname, 
      emp_position, 
      dep_code, 
      emp_type, 
      emp_tel, 
      emp_password, // รับมาเช็คว่ามีการส่งรหัสผ่านใหม่มาไหม
      deleteflag, 
      updatedby 
    } = req.body;

    // เตรียม Object สำหรับ Update (ไม่ใส่ emp_code เพราะเป็น PK ไม่ควรแก้)
    const updateData = { 
      emp_prefix, 
      emp_name, 
      emp_surname, 
      emp_position, 
      dep_code, 
      emp_type, 
      emp_tel, 
      deleteflag, 
      updatedby 
    };

    // 👉 เช็คว่ามีการส่งรหัสผ่านใหม่มาไหม? ถ้ามีถึงจะ Hash แล้วอัปเดต
    if (emp_password && emp_password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.emp_password = await bcrypt.hash(emp_password, salt);
    }

    const { data, error } = await supabase
      .from('emp_tbls')
      .update(updateData)
      .eq('emp_code', codeFromParam)
      .select('*, dep_tbls(dep_full, dep_short)')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Employee not found" });

    // Flatten dep_tbls object
    const result = {
      ...data,
      dep_full:  data.dep_tbls?.dep_full,
      dep_short: data.dep_tbls?.dep_short,
      dep_tbls:  undefined,
    };

    // ลบ password ออกจาก Response
    delete result.emp_password;

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;