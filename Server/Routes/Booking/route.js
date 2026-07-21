const express = require('express');
const router = express.Router();
const supabase = require('../../db');

router.get('/', async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('booking_tbls')
      .select('*')
      .order('booking_checkin', { ascending: false });
    if (error) throw error;

    const roomIds = [...new Set((bookings || []).map(b => b.room_id).filter(Boolean))];
    const confirmIds = [...new Set((bookings || []).map(b => b.confirm_id).filter(Boolean))];

    const roomNameMapTH = {};
    const roomNameMapEN = {};
    const roomPriceMap = {};
    const confirmMap = {};

    if (roomIds.length > 0) {
      const { data: rooms } = await supabase
        .from('room_tbls')
        .select('room_id, room_price, room_detail_th_tbls(room_detail_th_name), room_detail_en_tbls(room_detail_en_name)')
        .in('room_id', roomIds);

      (rooms || []).forEach(r => {
        roomNameMapTH[r.room_id] = r.room_detail_th_tbls?.room_detail_th_name || r.room_id;
        roomNameMapEN[r.room_id] = r.room_detail_en_tbls?.room_detail_en_name || r.room_id;
        roomPriceMap[r.room_id] = r.room_price;
      });
    }

    if (confirmIds.length > 0) {
      const { data: confirms } = await supabase
        .from('confirm_tbls')
        .select('*')
        .in('confirm_id', confirmIds);

      (confirms || []).forEach(c => {
        confirmMap[c.confirm_id] = c;
      });
    }

    const result = (bookings || []).map(b => ({
      ...b,
      room_name_th: roomNameMapTH[b.room_id] || b.room_id,
      room_name_en: roomNameMapEN[b.room_id] || b.room_id,
      room_price: roomPriceMap[b.room_id],
      confirm_status: confirmMap[b.confirm_id]?.confirm_status || null,
      confirm_emp_code: confirmMap[b.confirm_id]?.emp_code || null,
      confirm_createdat: confirmMap[b.confirm_id]?.createdat || null,
      confirm_remark: confirmMap[b.confirm_id]?.confirm_remark || null,
      confirm_slip: confirmMap[b.confirm_id]?.confirm_slip || null,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:booking_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('booking_tbls')
      .select('*')
      .eq('booking_id', req.params.booking_id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Booking not found' });

    let confirmInfo = {};
    if (data.confirm_id) {
      const { data: confirmData } = await supabase
        .from('confirm_tbls')
        .select('*')
        .eq('confirm_id', data.confirm_id)
        .single();
      if (confirmData) {
        confirmInfo = {
          confirm_status: confirmData.confirm_status,
          confirm_emp_code: confirmData.emp_code,
          confirm_createdat: confirmData.createdat,
          confirm_remark: confirmData.confirm_remark,
          confirm_slip: confirmData.confirm_slip,
        };
      }
    }

    res.json({ ...data, ...confirmInfo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      room_id, booking_name, booking_email, booking_phone,
      booking_detail, booking_adults, booking_children_free, booking_children_addon,
      booking_pet_free, booking_pet_addon, booking_checkin, booking_checkout,
      booking_price, booking_slip, confirm_id,
    } = req.body;

    // ── Auto-generate Booking ID: BK-YYMMDD-XXX ──
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yy}${mm}${dd}`;

    // ── Check for overlapping bookings ──
    const { data: overlaps, error: overlapErr } = await supabase
      .from('booking_tbls')
      .select('booking_id, booking_checkin, booking_checkout')
      .eq('room_id', room_id)
      .lt('booking_checkin', booking_checkout)
      .gt('booking_checkout', booking_checkin);

    if (overlapErr) throw overlapErr;
    if (overlaps && overlaps.length > 0) {
      return res.status(409).json({
        message: `Room is already booked for this date range. Overlaps with ${overlaps.map(b => b.booking_id).join(', ')}`,
      });
    }

    const { data: existing } = await supabase
      .from('booking_tbls')
      .select('booking_id')
      .like('booking_id', `BK-${datePrefix}-%`)
      .order('booking_id', { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (existing && existing.length > 0) {
      const last = existing[0].booking_id;
      const lastNum = parseInt(last.slice(-3), 10);
      nextNum = lastNum + 1;
    }
    const booking_id = `BK-${datePrefix}-${String(nextNum).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('booking_tbls')
      .insert([{
        booking_id, room_id, booking_name, booking_email, booking_phone,
        booking_detail, booking_adults, booking_children_free, booking_children_addon,
        booking_pet_free, booking_pet_addon, booking_checkin, booking_checkout,
        booking_price, booking_slip, confirm_id,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Confirm a booking ──
router.post('/:booking_id/confirm', async (req, res) => {
  try {
    const emp_code = req.user?.emp_code || req.body.emp_code;
    if (!emp_code) {
      return res.status(400).json({ message: 'emp_code is required' });
    }

    // ── Auto-generate Confirm ID: CF-YYMMDD-XXX ──
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yy}${mm}${dd}`;

    const { data: existing } = await supabase
      .from('confirm_tbls')
      .select('confirm_id')
      .like('confirm_id', `CF-${datePrefix}-%`)
      .order('confirm_id', { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (existing && existing.length > 0) {
      const last = existing[0].confirm_id;
      const lastNum = parseInt(last.slice(-3), 10);
      nextNum = lastNum + 1;
    }
    const confirm_id = `CF-${datePrefix}-${String(nextNum).padStart(3, '0')}`;

    const { data: confirmData, error: confirmErr } = await supabase
      .from('confirm_tbls')
      .insert([{
        confirm_id,
        booking_id: req.params.booking_id,
        confirm_status: 'confirmed',
        confirm_slip: req.body.confirm_slip || null,
        emp_code,
        createdby: emp_code,
        updatedby: emp_code,
      }])
      .select()
      .single();

    if (confirmErr) throw confirmErr;

    const { data: bookingData, error: updateErr } = await supabase
      .from('booking_tbls')
      .update({ confirm_id })
      .eq('booking_id', req.params.booking_id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    res.json({ confirm: confirmData, booking: bookingData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:booking_id', async (req, res) => {
  try {
    const {
      room_id, booking_name, booking_email, booking_phone,
      booking_detail, booking_adults, booking_children_free, booking_children_addon,
      booking_pet_free, booking_pet_addon, booking_checkin, booking_checkout,
      booking_slip, confirm_id,
    } = req.body;

    const updateData = {
      room_id, booking_name, booking_email, booking_phone,
      booking_detail, booking_adults, booking_children_free, booking_children_addon,
      booking_pet_free, booking_pet_addon, booking_checkin, booking_checkout,
      booking_slip, confirm_id,
    };

    Object.keys(updateData).forEach(k => {
      if (updateData[k] === undefined) delete updateData[k];
    });

    const { data, error } = await supabase
      .from('booking_tbls')
      .update(updateData)
      .eq('booking_id', req.params.booking_id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Booking not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
