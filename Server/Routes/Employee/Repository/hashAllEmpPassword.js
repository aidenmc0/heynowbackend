const sql = require("mssql");
const { poolYET } = require("../../../db");

// ดึงข้อมูลทั้งหมด
const getAllEmployees = async () => {
  const pool = await poolYET;

  const result = await pool
    .request()
    .query("SELECT emp_code, emp_password FROM emp_tbls WHERE [delete] = 'N'");

  return result.recordset;
};

// update password รายคน
const updatePassword = async (empCode, hashedPassword) => {
  const pool = await poolYET;

  return await pool
    .request()
    .input("empCode", sql.NVarChar(10), empCode)
    .input("empPassword", sql.NVarChar(255), hashedPassword)
    .query(`
      UPDATE emp_tbls
      SET emp_password = @empPassword
      WHERE emp_code = @empCode
    `);
};

module.exports = {
  getAllEmployees,
  updatePassword
};