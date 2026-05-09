const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getPurchaseList } = require('./Service/getPurchase');


router.get('/purchaseList', getPurchaseList);

module.exports = router;