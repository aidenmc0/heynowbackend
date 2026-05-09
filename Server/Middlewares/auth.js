const jwt = require("jsonwebtoken");
const { getTokenByEmp } = require("../Routes/Auth/Repository/sp_getTokenByEmp");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tokens = await getTokenByEmp(decoded.emp_code);

    const found = tokens.find(t => t.Token === token);

    if (!found)
      return res.status(403).json({ message: "Token not found" });

    if (new Date(found.Expired) < new Date())
      return res.status(403).json({ message: "Token expired" });

    req.user = decoded;
    next();

  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};