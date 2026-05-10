const express = require('express');
const router = express.Router();
const supabase = require('../../db');

// GET ALL
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emp_tbls')
      .select('*')
      .order('emp_code');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET BY ID  ← เพิ่มตรงนี้
router.get('/:emp_code', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emp_tbls')
      .select('*')
      .eq('emp_code', req.params.emp_code)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;