const sql = require("mssql");
const { poolYET } = require("../../../db");

const getDepartmentList = async (page, pageSize, search) => {
  const db = await poolYET; // resolve แค่ครั้งเดียวต่อ call

  const result = await db
    .request()
    .input("PageNumber", sql.Int, page)
    .input("PageSize", sql.Int, pageSize)
    .input("SearchTerm", sql.NVarChar(100), search || "")
    .execute("sp_getDepartmentList");

  return {
    totalCount: result.recordsets?.[0]?.[0]?.TotalCount || 0,
    pageNumber: page,
    pageSize,
    data: result.recordsets?.[1] || [],
  };
};

module.exports = { getDepartmentList /* ... */ };