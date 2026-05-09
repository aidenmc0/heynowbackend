const repo_getByCode = require('../Repository/sp_getEmployeeByCode');
const repo_getList = require('../Repository/sp_getEmployeeList');

const getEmployeeList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = null } = req.query;
    const result = await repo_getList.getEmployeeList(+page, +pageSize, search);
    res.json(result);
  } catch (err) { next(err); } // โยนไป errorHandler
};

const getEmployeeByCode = async (req, res, next) => {
  try {
    const { empCode } = req.params;

    const data = await repo_getByCode.getEmployeeByCode(empCode);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getEmployeeList, getEmployeeByCode /* ... */ };