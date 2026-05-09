const repo_getList = require('../Repository/sp_getTakeoutEquipmentList');

const getTakeoutEquipmentList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = null } = req.query;
    const result = await repo_getList.getTakeoutEquipmentList(+page, +pageSize, search);
    res.json(result);
  } catch (err) { next(err); } // โยนไป errorHandler
};

module.exports = { getTakeoutEquipmentList /* ... */ };