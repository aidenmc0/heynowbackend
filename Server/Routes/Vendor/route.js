const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getVendorList } = require('./Service/getVendor');


router.get('/vendorList', getVendorList);

module.exports = router;