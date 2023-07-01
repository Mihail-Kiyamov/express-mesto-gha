const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'mesto-backend');
  } catch (err) {
    const authError = new AuthError(err.message);
    next(authError);
  }

  req.user = payload;

  next();
};
