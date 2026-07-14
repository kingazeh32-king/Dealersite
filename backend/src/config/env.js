require('dotenv').config();

function parseAllowedOrigins(rawValue) {
  return (rawValue || 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

module.exports = {
  port:     parseInt(process.env.PORT, 10) || 5000,
  nodeEnv:  process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  clientUrls: parseAllowedOrigins(process.env.CLIENT_URL || 'http://localhost:3000'),
  jwt: {
    secret:    process.env.JWT_SECRET || 'replace-with-a-long-random-secret-for-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    dir:          process.env.UPLOAD_DIR || 'uploads',
    maxSizeBytes: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10) * 1024 * 1024,
  },
  mail: {
    enabled:   !!(process.env.SMTP_HOST && process.env.NOTIFY_EMAIL),
    host:      process.env.SMTP_HOST,
    port:      parseInt(process.env.SMTP_PORT, 10) || 587,
    user:      process.env.SMTP_USER,
    pass:      process.env.SMTP_PASS,
    from:      process.env.MAIL_FROM || 'noreply@dealersite.com',
    notifyTo:  process.env.NOTIFY_EMAIL,
  },
};
