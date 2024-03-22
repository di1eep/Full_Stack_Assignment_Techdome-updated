const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Token missing" });
  }
  const token = req.headers.authorization.split(" ")[0];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Token missing" });
  }
  try {
    const decodedToken = jwt.verify(token, "your_secret_key");
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token" });
  }
};

module.exports = authMiddleware;
