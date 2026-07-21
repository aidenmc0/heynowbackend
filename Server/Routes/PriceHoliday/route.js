const express = require('express');
const router = express.Router();
const supabase = require('../../db');

// ── GET all holiday overrides ──
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('price_holiday_tbls')
      .select('*')
      .eq('deleteflag', 'N')
      .order('specific_date', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST: add a holiday override ──
// Body: { specific_date: "2026-07-22", note: "วันเข้าพรรษา" }
router.post('/', async (req, res) => {
  try {
    const { specific_date, note } = req.body;
    if (!specific_date) {
      return res.status(400).json({ message: 'specific_date is required' });
    }

    const empCode = req.user?.emp_code || 'system';
    const dateStr = specific_date.replace(/-/g, '');
    const holidayId = `OH-${dateStr}`;

    const { data, error } = await supabase
      .from('price_holiday_tbls')
      .insert([{
        holiday_id: holidayId,
        specific_date,
        note: note || null,
        createdby: empCode,
        updatedby: empCode,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE: remove a holiday override ──
router.delete('/:holiday_id', async (req, res) => {
  try {
    const empCode = req.user?.emp_code || 'system';
    const { data, error } = await supabase
      .from('price_holiday_tbls')
      .update({ deleteflag: 'Y', updatedby: empCode, updatedat: new Date() })
      .eq('holiday_id', req.params.holiday_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Deleted', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
