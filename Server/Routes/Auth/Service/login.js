const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../../../db");
const { postToken } = require("../Repository/postToken");

const login = async (req, res, next) => {
  try {
    const { emp_code, password } = req.body;

    if (!emp_code || !password) {
      return res.status(400).json({ message: "emp_code and password are required" });
    }

    // 🔍 Get employee from Supabase
    const { data: employees, error } = await supabase
      .from("emp_tbls")
      .select("*")
      .eq("emp_code", emp_code)
      .eq("deleteflag", "N")
      .limit(1);

    if (error) throw new Error(error.message);

    const employee = employees?.[0];

    if (!employee) {
      return res.status(401).json({ message: "Employee not found" });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, employee.emp_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🔑 Create JWT
    const token = jwt.sign(
      {
        emp_code: employee.emp_code,
        name:     employee.emp_name,
        dep:      employee.dep_code,
        type:     employee.emp_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 🧾 Token code (20 chars)
    const token_code = uuidv4().replace(/-/g, "").substring(0, 20);

    // ⏱ Expiry
    const expired = new Date(Date.now() + 8 * 60 * 60 * 1000);

    // 💾 Save token
    await postToken({
      token_code,
      emp_code:  employee.emp_code,
      token,
      expired,
      createdBy: employee.emp_code,
    });

    res.json({
      token,
      employee: {
        emp_code: employee.emp_code,
        name:     `${employee.emp_prefix} ${employee.emp_name} ${employee.emp_surname}`,
        dep_code: employee.dep_code,
        position: employee.emp_position,
        type:     employee.emp_type,
      },
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { login };