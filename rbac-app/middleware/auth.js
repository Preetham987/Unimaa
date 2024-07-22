const jwt = require('jsonwebtoken');
const User = require('../models/UIser');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      const token = req.header('Authorization').replace('Bearer ', '');
      if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
      }

      try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;

        if (roles.length && !roles.includes(req.user.role)) {
          return res.status(403).send({ error: 'Forbidden' });
        }

        next();
      } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
      }
    },
  ];
};

module.exports = auth;
