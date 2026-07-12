const express = require('express');
const router = express.Router();
const supabase = require('../../db');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('booking_tbls')
      .select('*')
      .order('booking_checkin', { ascending: false });
    if (error) throw error;
    res.json(data || []);
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
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      booking_id, room_id, booking_name, booking_email, booking_phone,
      booking_detail, booking_adults, booking_children_free, booking_children_addon,
      booking_pet_free, booking_pet_addon, booking_checkin, booking_checkout,
      booking_slip, confirm_id,
    } = req.body;

    const { data, error } = await supabase
      .from('booking_tbls')
      .insert([{
        booking_id, room_id, booking_name, booking_email, booking_phone,
        booking_detail, booking_adults, booking_children_free, booking_children_addon,
        booking_pet_free, booking_pet_addon, booking_checkin, booking_checkout,
        booking_slip, confirm_id,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
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
