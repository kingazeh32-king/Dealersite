const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs incoming requests and outgoing responses
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Capture response end
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    logger.log(logLevel, 'HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return originalSend.call(this, data);
  };

  next();
}

module.exports = requestLogger;
