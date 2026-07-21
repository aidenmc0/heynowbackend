const express = require('express');
const router = express.Router();
const supabase = require('../../db');

function formatPriceId(roomId, year, month) {
  const num = roomId.replace(/^R/i, '');
  const mm = String(month).padStart(2, '0');
  return `PR${num}-${year}-${mm}`;
}

// ── GET prices (optional ?room_id=&year=) ──
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('price_room_tbls')
      .select('*')
      .eq('deleteflag', 'N')
      .order('room_id')
      .order('price_year')
      .order('price_month');

    if (req.query.room_id) {
      query = query.eq('room_id', req.query.room_id);
    }
    if (req.query.year) {
      query = query.eq('price_year', Number(req.query.year));
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Batch upsert prices for a room + year ──
// Body: { room_id, price_year, prices: [{ price_month, workingday_price, holiday_price }] }
router.put('/batch', async (req, res) => {
  try {
    const { room_id, price_year, prices } = req.body;
    if (!room_id || !price_year || !prices || !Array.isArray(prices)) {
      return res.status(400).json({ message: 'room_id, price_year, and prices[] required' });
    }

    const empCode = req.user?.emp_code || 'system';
    const rows = prices.map((p) => ({
      price_room_id: formatPriceId(room_id, price_year, p.price_month),
      room_id,
      price_year,
      price_month: p.price_month,
      workingday_price: p.workingday_price,
      holiday_price: p.holiday_price,
      createdby: empCode,
      updatedby: empCode,
    }));

    const { data, error } = await supabase
      .from('price_room_tbls')
      .upsert(rows, { onConflict: 'room_id, price_year, price_month', ignoreDuplicates: false })
      .select()
      .order('price_month');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
