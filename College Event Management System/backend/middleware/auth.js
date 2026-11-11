const jwt = require("jsonwebtoken");

// Only lets the request through if it carries a valid admin token
module.exports = function adminOnly(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Admin login required" });
  }
};
