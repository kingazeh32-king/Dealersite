const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const { clientUrl, clientUrls, upload } = require('./config/env');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();

const allowedOrigins = Array.isArray(clientUrls) ? clientUrls : [clientUrl];

// CORS configuration with validation
const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isConfiguredOrigin = allowedOrigins.some((allowedOrigin) => {
      try {
        const requestUrl = new URL(origin);
        const allowedUrl = new URL(allowedOrigin);
        return (
          requestUrl.protocol === allowedUrl.protocol &&
          requestUrl.hostname === allowedUrl.hostname &&
          requestUrl.port === allowedUrl.port
        );
      } catch {
        return false;
      }
    });

    const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

    if (isConfiguredOrigin || isLocalhostOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

if (!clientUrl || clientUrl === 'http://localhost:3000') {
  logger.warn('CORS origin not explicitly configured. Using default:', clientUrl);
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

app.use('/uploads', express.static(path.join(process.cwd(), upload.dir)));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
