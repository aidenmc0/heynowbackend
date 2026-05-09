const repo = require('../Repository/sp_getEquipmentList');

const getEquipmentList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = null } = req.query;
    const result = await repo.getEquipmentList(+page, +pageSize, search);
    res.json(result);
  } catch (err) { next(err); } // โยนไป errorHandler
};

module.exports = { getEquipmentList };