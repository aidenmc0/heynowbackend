const repo_post = require("../Repository/sp_postEmployee");

const postEmployee = async (req, res, next) => {
  try {
    let {
      isRevision,
      base_emp_code,
      emp_code,
      dep_code,
      emp_type,
      emp_prefix,
      emp_name,
      emp_surname,
      emp_position,
      emp_email,
      emp_password,
      createdBy,
    } = req.body;

    isRevision = isRevision == 1 ? 1 : 0;

    const clean = (v) =>
      v === "null" || v === "undefined" || v === "" ? null : v;

    base_emp_code = clean(base_emp_code);
    emp_code = clean(emp_code);

    let emp_img = null;
    if (req.file) {
      emp_img = req.file.filename;
    }

    // ✅ VALIDATION
    if (!dep_code) throw new Error("dep_code is required");
    if (!emp_type) throw new Error("emp_type is required");
    if (!emp_prefix) throw new Error("emp_prefix is required");
    if (!emp_name) throw new Error("emp_name is required");
    if (!emp_surname) throw new Error("emp_surname is required");
    if (!emp_position) throw new Error("emp_position is required");
    if (!emp_email) throw new Error("emp_email is required");
    if (!emp_password) throw new Error("emp_password is required");
    if (!createdBy) throw new Error("createdBy is required");

    if (isRevision === 1) {
      if (!base_emp_code)
        throw new Error("base_emp_code is required for revision");
    } else {
      if (!emp_code)
        throw new Error("emp_code is required for new employee");
    }

    // ✅ CALL SP
    const result = await repo_post.postEmployee({
      isRevision,
      base_emp_code,
      emp_code,
      dep_code,
      emp_img,
      emp_type,
      emp_prefix,
      emp_name,
      emp_surname,
      emp_position,
      emp_email,
      emp_password,
      createdBy,
    });

    if (result?.emp_code === -1) {
      return res.status(400).json({ error: "Employee code already exists" });
    }

    if (!result?.emp_code) {
      return res.status(500).json({ error: "Failed to create employee" });
    }

    res.status(201).json({
      success: true,
      emp_code: result.emp_code,
      emp_img: emp_img,
      message:
        isRevision === 1
          ? "Employee revision created"
          : "Employee created successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { postEmployee };