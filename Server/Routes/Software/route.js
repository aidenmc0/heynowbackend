const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getSoftwareList } = require('./Service/getSoftware');


router.get('/softwareList', getSoftwareList);

module.exports = router;