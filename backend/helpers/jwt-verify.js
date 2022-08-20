const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/index');

const jwtVerify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return false;
  }
};

module.exports = jwtVerify;
