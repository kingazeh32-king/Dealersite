const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const db = require('../db/queries');

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.admin = { id: payload.id, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function loadAdmin(req, res, next) {
  try {
    const admin = await db.admins.findById(req.admin.id);
    if (!admin) {
      return res.status(401).json({ error: 'Admin account not found' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticate, loadAdmin };
