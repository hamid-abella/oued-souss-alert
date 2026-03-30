const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | URL: ${req.url} | Method: ${req.method}`);

  // PostgreSQL: foreign key violation
  if (err.code === '23503')
    return res.status(400).json({ error: 'Invalid reference (foreign key).' });

  // PostgreSQL: CHECK constraint violation
  if (err.code === '23514')
    return res.status(400).json({ error: 'Value out of allowed range.' });

  // PostgreSQL: unique constraint violation
  if (err.code === '23505')
    return res.status(409).json({ error: 'Entry already exists.' });

  // PostgreSQL: trigger RAISE EXCEPTION (outlier values, e.g. -50m)
  if (err.code === 'P0001')
    return res.status(422).json({ error: err.message });

  // Input validation errors (sanitizeId, sanitizeNumeric)
  if (err.message?.includes('Invalid ID') ||
      err.message?.includes('out of range'))
    return res.status(400).json({ error: err.message });

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error.'
  });
};

module.exports = errorHandler;