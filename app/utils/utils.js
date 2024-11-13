const crypto = require("crypto");
const { JWT_SECRET } = require("../config/constant");

exports.hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token)
    return res
      .status(401)
      .send({ message: "invalid user and invalid request" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};


