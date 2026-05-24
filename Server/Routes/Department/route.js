const express = require('express');
const router = express.Router();
const supabase = require('../../db');

// GET ALL
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dep_tbls')
      .select('*')
      .order('dep_code');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET BY ID
router.get('/:dep_code', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dep_tbls')
      .select('*')
      .eq('dep_code', req.params.dep_code) 
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST (CREATE) DEPARTMENT
router.post('/', async (req, res) => {
  try {
    const { dep_code, dep_full, dep_short, deleteflag, createdby } = req.body;

    // ตรวจสอบข้อมูลจำเป็น
    if (!dep_code || !dep_full || !dep_short) {
      return res.status(400).json({ message: "dep_code, dep_full, and dep_short are required" });
    }

    const { data, error } = await supabase
      .from('dep_tbls')
      .insert([{ 
        dep_code, 
        dep_full, 
        dep_short, 
        deleteflag: deleteflag || 'N', // ถ้าไม่ส่งมาให้ default เป็น N
        createdby 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (UPDATE) DEPARTMENT
router.put('/:dep_code', async (req, res) => {
  try {
    const { dep_code: codeFromParam } = req.params;
    const { dep_full, dep_short, deleteflag, updatedby } = req.body;

    // เตรียม Object สำหรับ Update 
    // 👉 ไม่ควรแก้ dep_code เพราะเป็น Primary Key เราจะไม่ส่งมันเข้าไปใน updateData
    const updateData = { 
      dep_full, 
      dep_short, 
      deleteflag, 
      updatedby 
    };

    // ลบ field ที่เป็น undefined ออกไป เพื่อไม่ให้ Supabase เซ็ตค่าเป็น null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const { data, error } = await supabase
      .from('dep_tbls')
      .update(updateData)
      .eq('dep_code', codeFromParam)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Department not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;