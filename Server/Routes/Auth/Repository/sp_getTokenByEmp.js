const sql = require("mssql");
const { poolITMIS } = require("../../../db");

const getTokenByEmp = async (empCode) => {
  const db = await poolITMIS; // ✅ เปลี่ยนตรงนี้

  const result = await db
    .request()
    .input("empCode", sql.NVarChar(10), empCode)
    .execute("sp_getTokenByEmp");

  return result.recordset;
};

module.exports = { getTokenByEmp };