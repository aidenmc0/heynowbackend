const express = require('express');
const router = express.Router();
const uploadSlip = require('../../Upload/uploadSlip');
const uploadConfirm = require('../../Upload/uploadConfirm');
const supabase = require('../../db');

router.post('/slip', (req, res) => {
  uploadSlip.single('slip')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/slips/${req._slipDateRel}/${req.file.filename}`;
    const { booking_id } = req.body;

    if (booking_id) {
      const { error } = await supabase
        .from('booking_tbls')
        .update({ booking_slip: filePath })
        .eq('booking_id', booking_id);

      if (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    res.json({ path: filePath, filename: req.file.filename });
  });
});

router.post('/confirm-slip', (req, res) => {
  uploadConfirm.single('slip')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/confirm/${req._confirmDateRel}/${req.file.filename}`;
    const { confirm_id } = req.body;

    if (confirm_id) {
      const { error } = await supabase
        .from('confirm_tbls')
        .update({ confirm_slip: filePath })
        .eq('confirm_id', confirm_id);

      if (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    res.json({ path: filePath, filename: req.file.filename });
  });
});

module.exports = router;
