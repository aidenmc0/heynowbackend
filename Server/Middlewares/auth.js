const jwt = require("jsonwebtoken");
const { getTokenByEmp } = require("../Routes/Auth/Repository/getTokenByEmp");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ดึง tokens ของ emp นี้จาก Supabase
    const tokens = await getTokenByEmp(decoded.emp_code);

    // ✅ หา token ที่ตรงกัน (column ชื่อ token ใน Supabase เป็น lowercase)
    const found = tokens.find((t) => t.token === token);

    if (!found) {
      return res.status(403).json({ message: "Token not found" });
    }

    if (new Date(found.expired) < new Date()) {
      return res.status(403).json({ message: "Token expired" });
    }

    req.user = decoded;
    next();

  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};