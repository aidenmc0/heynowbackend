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

module.exports = router;