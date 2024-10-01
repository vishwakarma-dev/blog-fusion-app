const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('jwt-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Un-authorised access!'});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'In-valid Token!'});
  }
};
