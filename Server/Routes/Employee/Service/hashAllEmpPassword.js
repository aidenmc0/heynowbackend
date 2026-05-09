const bcrypt = require("bcrypt");
const repo = require("../Repository/hashAllEmpPassword");

const hashAllEmpPassword = async (req, res, next) => {
  try {
    const employees = await repo.getAllEmployees();

    let count = 0;

    for (const emp of employees) {
      // ❗ สำคัญ: เอาค่าเดิมมา hash
      const hashed = await bcrypt.hash(emp.emp_password, 10);

      await repo.updatePassword(emp.emp_code, hashed);

      count++;
    }

    res.json({
      message: "All passwords hashed successfully",
      total: count
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { hashAllEmpPassword };