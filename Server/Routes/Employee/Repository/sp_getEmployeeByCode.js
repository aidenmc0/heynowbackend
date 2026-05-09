const sql = require("mssql");
const { poolYET } = require("../../../db");

// 🔥 GET BY EMP CODE
const getEmployeeByCode = async (empCode) => {
  const db = await poolYET;

  const result = await db
    .request()
    .input("empCode", sql.NVarChar(20), empCode)
    .execute("sp_getEmployeeByCode");

  return result.recordset?.[0] || null;
};

module.exports = {
  getEmployeeByCode,
};