const sql = require('mssql');
const { poolITMIS } = require("../../../db");

const getEquipmentList = async (page, pageSize, search) => {
  const db = await poolITMIS;

  const result = await db
    .request()
    .input('PageNumber', sql.Int, page)
    .input('PageSize',   sql.Int, pageSize)
    .input('SearchTerm', sql.NVarChar(100), search)
    .execute('sp_getEquipmentList');

  return {
    totalCount: result.recordsets[0][0].TotalCount,
    pageNumber: page,
    pageSize,
    data: result.recordsets[1],
  };
};
module.exports = { getEquipmentList /* ... */ };