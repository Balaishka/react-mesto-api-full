const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../configs/index');
const { NODE_ENV, JWT_SECRET } = process.env;

const jwtSign = (id) => jwt.sign({ _id: id }, NODE_ENV === 'production' ? JWT_SECRET : 'balai-secret', { expiresIn: '7d' });

module.exports = jwtSign;
