const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const { UNAUTHORIZED_CODE } = require('../utils/errors');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED_CODE).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(UNAUTHORIZED_CODE).send({ message: "Unauthorized" });
  }

  return null;
}

module.exports = auth;