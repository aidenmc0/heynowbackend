const express = require('express');
const router = express.Router();
const auth = require('../../Middlewares/auth');
const { getDepartmentList } = require('./Service/getDepartment');

router.get('/departmentList', getDepartmentList);

module.exports = router;