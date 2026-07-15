require('dotenv').config();

const DEFAULT_JWT_SECRET = 'replace-with-a-long-random-secret-for-production';

function parseAllowedOrigins(rawValue) {
  const parsed = (rawValue || 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return parsed.length ? parsed : ['http://localhost:3000'];
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const clientUrls = parseAllowedOrigins(process.env.CLIENT_URL || process.env.CLIENT_URLS);

const jwtSecret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

if (isProduction) {
  if (!process.env.JWT_SECRET || jwtSecret === DEFAULT_JWT_SECRET) {
    throw new Error(
      'JWT_SECRET must be set to a long random value when NODE_ENV=production'
    );
  }
  if (!process.env.CLIENT_URL && !process.env.CLIENT_URLS) {
    throw new Error(
      'CLIENT_URL (or CLIENT_URLS) must be set when NODE_ENV=production'
    );
  }
}

function resolveStorageDriver() {
  const explicit = (process.env.STORAGE_DRIVER || '').toLowerCase();
  if (explicit === 's3' || explicit === 'local') return explicit;
  if (process.env.S3_BUCKET) return 's3';
  return 'local';
}

const storageDriver = resolveStorageDriver();

if (storageDriver === 's3') {
  const required = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `S3 storage selected but missing env: ${missing.join(', ')}`
    );
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv,
  isProduction,
  clientUrl: clientUrls[0] || 'http://localhost:3000',
  clientUrls,
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSizeBytes:
      (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10) * 1024 * 1024,
  },
  storage: {
    driver: storageDriver,
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || '',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      publicUrl: process.env.S3_PUBLIC_URL || '',
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    },
  },
  mail: {
    enabled: !!(process.env.SMTP_HOST && process.env.NOTIFY_EMAIL),
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'noreply@dealersite.com',
    notifyTo: process.env.NOTIFY_EMAIL,
  },
};
