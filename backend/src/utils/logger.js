const winston = require('winston');
const path = require('path');

const { NODE_ENV = 'development' } = process.env;

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'dealer-site-api' },
  transports: [
    // Console transport (always)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let metaStr = '';
          if (Object.keys(meta).length > 0 && meta.service !== 'dealer-site-api') {
            metaStr = ' ' + JSON.stringify(meta);
          }
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    }),
    // File transports (errors and combined)
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
    }),
  ],
});

module.exports = logger;
