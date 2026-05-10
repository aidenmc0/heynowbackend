const express = require('express');
const router = express.Router();
const supabase = require('../../db');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emp_tbls')
      .select('*')
      .order('emp_code');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;