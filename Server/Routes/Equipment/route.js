const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { getEquipmentList } = require('./Service/getEquipment');

router.get('/equipmentList',getEquipmentList);

module.exports = router;