const jwt = require("jsonwebtoken");

const { JWT_SECRET = 'default_secret' } = process.env;

const UnauthorizedError = require("../errors/UnauthorizedError");

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization Error");
  }

  const token = extractBearerToken(authorization);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError("Authorization Error");
  }
};
