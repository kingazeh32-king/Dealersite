const logger = require('../utils/logger');
const { nodeEnv } = require('../config/env');

function notFound(req, res) {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
  });
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

function errorHandler(err, req, res, _next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    logger.warn('File upload size limit exceeded', {
      limit: err.limit,
      path: req.path,
    });
    return res.status(400).json({ error: 'File too large' });
  }

  if (err.message && (
    err.message.includes('Only JPEG') ||
    err.message.includes('Only PNG') ||
    err.message.includes('favicon')
  )) {
    logger.warn('Invalid file type uploaded', {
      message: err.message,
      path: req.path,
    });
    return res.status(400).json({ error: err.message });
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    status: err.status || 500,
  });

  res.status(err.status || 500).json({
    error: nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
}

module.exports = { notFound, errorHandler };
