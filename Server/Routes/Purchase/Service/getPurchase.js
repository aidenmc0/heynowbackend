const repo_getList = require('../Repository/sp_getPurchaseList');

const getPurchaseList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = null } = req.query;
    const result = await repo_getList.getPurchaseList(+page, +pageSize, search);
    res.json(result);
  } catch (err) { next(err); } // โยนไป errorHandler
};

module.exports = { getPurchaseList /* ... */ };