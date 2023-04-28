const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require('../utils/config')

const { UNAUTHORIZED_CODE } = require("../utils/errors");

const handleAuthError = (res) => {
  res.status(UNAUTHORIZED_CODE).send({ message: "Authorization Error" });
};

const exctractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = exctractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
