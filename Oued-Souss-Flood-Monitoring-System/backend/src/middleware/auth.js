const jwt               = require('jsonwebtoken');
const { PERMISSIONS }   = require('../config/roles');
const { JWT_SECRET }    = require('../config/env');

// Verifies the Bearer JWT token and attaches decoded payload to req.user.
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing or invalid token.' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { user_id, role, email }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Expired or invalid token.' });
  }
};

// RBAC permission check.
// Usage: authorizeRole('zones', 'create')
// Automatically calls authenticateJWT first if req.user is not set.
const authorizeRole = (resource, action) => {
  return (req, res, next) => {
    // Run authenticateJWT inline if not already applied on the route
    if (!req.user) {
      return authenticateJWT(req, res, () => checkPermission(req, res, next, resource, action));
    }
    checkPermission(req, res, next, resource, action);
  };
};

const checkPermission = (req, res, next, resource, action) => {
  const role = req.user?.role;

  if (!role)
    return res.status(403).json({ error: 'User role not defined.' });

  const allowed = PERMISSIONS[resource]?.[role]?.includes(action);

  if (!allowed)
    return res.status(403).json({
      error: `Access denied. Role '${role}' is not allowed to perform '${action}' on '${resource}'.`
    });

  next();
};

module.exports = { authenticateJWT, authorizeRole };