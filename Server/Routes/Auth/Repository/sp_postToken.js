const sql = require("mssql");
const { poolITMIS } = require("../../../db");

const postToken = async ({
  token_code,
  emp_code,
  token,
  expired,
  createdBy,
}) => {
  const db = await poolITMIS; // ✅ ให้เหมือน Employee

  const result = await db
    .request()
    .input("token_code", sql.NVarChar(20), token_code)
    .input("emp_code", sql.NVarChar(10), emp_code)
    .input("token", sql.NVarChar(sql.MAX), token)
    .input("expired", sql.DateTimeOffset, expired)
    .input("createdBy", sql.NVarChar(30), createdBy)
    .execute("sp_postToken");

  return result.returnValue;
};

module.exports = { postToken };