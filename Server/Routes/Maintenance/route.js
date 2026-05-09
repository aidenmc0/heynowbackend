const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

const { getMaintenanceList } = require('./Service/getMaintenance');


router.get('/maintenanceList', getMaintenanceList);

module.exports = router;