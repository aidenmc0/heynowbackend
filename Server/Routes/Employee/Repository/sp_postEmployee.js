const sql = require("mssql");
const { poolYET } = require("../../../db");

// 🔥 POST EMPLOYEE - New Employee or Revision
const postEmployee = async (employeeData) => {
  const db = await poolYET;

  const result = await db
    .request()
    .input("isRevision", sql.Bit, employeeData.isRevision)
    .input("base_emp_code", sql.NVarChar(10), employeeData.base_emp_code || null)
    .input("emp_code", sql.NVarChar(10), employeeData.emp_code || null)
    .input("dep_code", sql.NVarChar(20), employeeData.dep_code)
    .input("emp_img", sql.NVarChar(255), employeeData.emp_img || null)
    .input("emp_type", sql.NVarChar(10), employeeData.emp_type)
    .input("emp_prefix", sql.NVarChar(5), employeeData.emp_prefix)
    .input("emp_name", sql.NVarChar(25), employeeData.emp_name)
    .input("emp_surname", sql.NVarChar(25), employeeData.emp_surname)
    .input("emp_position", sql.NVarChar(10), employeeData.emp_position)
    .input("emp_email", sql.NVarChar(100), employeeData.emp_email)
    .input("emp_password", sql.NVarChar(100), employeeData.emp_password)
    .input("createdBy", sql.NVarChar(50), employeeData.createdBy)
    .execute("sp_postEmployee");

  return result.recordset?.[0] || null;
};

module.exports = { postEmployee };