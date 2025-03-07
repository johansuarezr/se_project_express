const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../customErrors/unauthorized-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
