const sql = require("mssql");
const { poolITMIS } = require("../../../db");

const getPurchaseList = async (page, pageSize, search) => {
  const db = await poolITMIS; // resolve แค่ครั้งเดียวต่อ call

  const result = await db
    .request()
    .input("PageNumber", sql.Int, page)
    .input("PageSize", sql.Int, pageSize)
    .input("SearchTerm", sql.NVarChar(100), search || "")
    .execute("sp_getPurchaseList");

  return {
    totalCount: result.recordsets?.[0]?.[0]?.TotalCount || 0,
    pageNumber: page,
    pageSize,
    data: result.recordsets?.[1] || [],
  };
};

module.exports = { getPurchaseList /* ... */ };