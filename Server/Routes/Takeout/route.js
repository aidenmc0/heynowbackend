const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getTakeoutEquipmentList } = require('./Service/getTakeoutEquipment');


router.get('/takeoutList', getTakeoutEquipmentList);

module.exports = router;