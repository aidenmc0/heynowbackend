const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getAccessList } = require('./Service/getAccess');


router.get('/accessList', getAccessList);

module.exports = router;