const repo_getList = require('../Repository/sp_getSoftwareList');

const getSoftwareList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = null } = req.query;
    const result = await repo_getList.getSoftwareList(+page, +pageSize, search);
    res.json(result);
  } catch (err) { next(err); } // โยนไป errorHandler
};

module.exports = { getSoftwareList /* ... */ };