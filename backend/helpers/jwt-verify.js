const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const jwtVerify = (token) => {
  try {
    return jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'balai-secret');
  } catch (err) {
    return false;
  }
};

module.exports = jwtVerify;
