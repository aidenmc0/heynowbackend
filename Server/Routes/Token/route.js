const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getTokenList } = require('./Service/getToken');


router.get('/tokenList', getTokenList);

module.exports = router;