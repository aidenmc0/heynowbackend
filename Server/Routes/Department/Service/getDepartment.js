const repo_getList = require('../Repository/sp_getDepartmentList');

const getDepartmentList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = null } = req.query;
    const result = await repo_getList.getDepartmentList(+page, +pageSize, search);
    res.json(result);
  } catch (err) { next(err); } // โยนไป errorHandler
};

module.exports = { getDepartmentList /* ... */ };