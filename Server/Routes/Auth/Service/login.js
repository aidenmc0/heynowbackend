const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// 👇 Employee repo
const empRepo = require("../../Employee/Repository/sp_getEmployeeByCode");

// 👇 Auth repo
const { postToken } = require("../Repository/sp_postToken");

const login = async (req, res, next) => {
  try {
    const { empCode, password } = req.body;

    // 🔍 get employee
    const employee = await empRepo.getEmployeeByCode(empCode);

    if (!employee) {
      return res.status(401).json({ message: "Employee not found" });
    }

    // 🔐 CHECK PASSWORD (bcrypt)
    const isMatch = await bcrypt.compare(
      password,
      employee.EmpPassword
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🔑 create JWT
    const token = jwt.sign(
      {
        emp_code: employee.EmpCode,
        name: employee.EmpName,
        dep: employee.DepCode
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 🧾 token code
    const tokenCode = uuidv4().replace(/-/g, "").substring(0, 20);

    // ⏱ expire
    const expired = new Date(Date.now() + 8 * 60 * 60 * 1000);

    // 💾 save token
    const result = await postToken({
      token_code: tokenCode,
      emp_code: employee.EmpCode,
      token,
      expired,
      createdBy: employee.EmpCode
    });

    if (result !== 1) {
      return res.status(500).json({ message: "Cannot save token" });
    }

    res.json({
      token,
      employee: {
        empCode: employee.EmpCode,
        name: employee.EmpName,
        dep: employee.DepFull
      }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { login };