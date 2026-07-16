const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const {
  clientUrl,
  clientUrls,
  upload,
  isProduction,
  storage,
} = require('./config/env');
const { uploadRoot } = require('./utils/upload');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();

const allowedOrigins = Array.isArray(clientUrls) ? clientUrls : [clientUrl];

if (!process.env.CLIENT_URL && !process.env.CLIENT_URLS) {
  logger.warn('CORS origin not explicitly configured. Using default:', clientUrl);
} else {
  logger.info('CORS allowed origins:', allowedOrigins.join(', '));
}

const corsOptions = {
  origin(origin, callback) {
    // Non-browser clients (curl, server-to-server) often omit Origin
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

    const isLocalhostOrigin =
      !isProduction &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

    if (isConfiguredOrigin || isLocalhostOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// Local disk uploads are served by Express; S3 files use their public URL.
// Use the same resolved uploadRoot multer writes to (supports absolute UPLOAD_DIR).
if (storage.driver === 'local') {
  const staticRoot = uploadRoot || path.resolve(process.cwd(), upload.dir);
  logger.info(`Serving uploads from ${staticRoot}`);
  app.use('/uploads', express.static(staticRoot, { fallthrough: true, index: false }));
}

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
