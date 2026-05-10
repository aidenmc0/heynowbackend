const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const uploadEmployee = require('../../Upload/uploadEmployee');

const { getEmployeeList,getEmployeeByCode } = require('./Service/getEmployee');
const { postEmployee } = require('./Service/postEmployee');

const { hashAllEmpPassword } = require('./Service/hashAllEmpPassword');

router.get('/employeeList', getEmployeeList);
router.get("/:empCode", getEmployeeByCode);
router.post("/hashAllEmpPassword", hashAllEmpPassword);
router.post("/post", auth, uploadEmployee.single('emp_img'), postEmployee);

module.exports = router;