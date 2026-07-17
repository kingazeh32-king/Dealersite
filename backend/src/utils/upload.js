const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { upload, storage: storageConfig } = require('../config/env');
const logger = require('./logger');

const uploadRoot = path.resolve(process.cwd(), upload.dir);
const SUBDIRS = ['properties', 'site', 'team', 'floorplans', 'tours'];

for (const subdir of SUBDIRS) {
  const dir = path.join(uploadRoot, subdir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const propertiesDir = path.join(uploadRoot, 'properties');
const siteDir = path.join(uploadRoot, 'site');
const teamDir = path.join(uploadRoot, 'team');
const floorplansDir = path.join(uploadRoot, 'floorplans');
const toursDir = path.join(uploadRoot, 'tours');

const useS3 = storageConfig.driver === 's3';

let s3Client = null;
if (useS3) {
  s3Client = new S3Client({
    region: storageConfig.s3.region,
    endpoint: storageConfig.s3.endpoint || undefined,
    forcePathStyle: storageConfig.s3.forcePathStyle,
    credentials: {
      accessKeyId: storageConfig.s3.accessKeyId,
      secretAccessKey: storageConfig.s3.secretAccessKey,
    },
  });
  logger.info(`Upload storage: S3 bucket "${storageConfig.s3.bucket}"`);
} else {
  logger.info(`Upload storage: local disk (${uploadRoot})`);
}

function uniqueName(originalName, prefix = '') {
  const ext = path.extname(originalName).toLowerCase();
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  return `${prefix}${unique}${ext}`;
}

function localPublicUrl(folder, filename) {
  return `/uploads/${folder}/${filename}`;
}

function s3PublicUrl(key) {
  if (storageConfig.s3.publicUrl) {
    return `${storageConfig.s3.publicUrl.replace(/\/$/, '')}/${key}`;
  }
  if (storageConfig.s3.endpoint) {
    const base = storageConfig.s3.endpoint.replace(/\/$/, '');
    return `${base}/${storageConfig.s3.bucket}/${key}`;
  }
  return `https://${storageConfig.s3.bucket}.s3.${storageConfig.s3.region}.amazonaws.com/${key}`;
}

/** Public URL stored in the DB for a multer file in the given folder. */
function filePublicUrl(file, folder) {
  if (file?.publicUrl) return file.publicUrl;
  return localPublicUrl(folder, file.filename);
}

function createS3Storage(folder, nameFn) {
  return {
    _handleFile(req, file, cb) {
      const chunks = [];
      file.stream.on('data', (chunk) => chunks.push(chunk));
      file.stream.on('error', (err) => cb(err));
      file.stream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const filename = nameFn(file);
          const key = `${folder}/${filename}`;

          await s3Client.send(
            new PutObjectCommand({
              Bucket: storageConfig.s3.bucket,
              Key: key,
              Body: buffer,
              ContentType: file.mimetype,
            })
          );

          cb(null, {
            filename,
            key,
            size: buffer.length,
            publicUrl: s3PublicUrl(key),
          });
        } catch (err) {
          cb(err);
        }
      });
    },
    _removeFile(_req, file, cb) {
      cb(null);
    },
  };
}

function createDiskStorage(destDir, nameFn) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destDir),
    filename: (_req, file, cb) => cb(null, nameFn(file)),
  });
}

function buildMulter({ folder, destDir, nameFn, fileFilter, maxSizeBytes }) {
  const storage = useS3
    ? createS3Storage(folder, nameFn)
    : createDiskStorage(destDir, nameFn);

  return multer({
    storage,
    limits: { fileSize: maxSizeBytes || upload.maxSizeBytes },
    fileFilter,
  });
}

const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
  }
};

const logoFilter = (_req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, GIF, and SVG images are allowed'));
  }
};

const faviconFilter = (_req, file, cb) => {
  const allowed = [
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/jpeg',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, SVG, ICO, WebP, GIF, or JPEG favicons are allowed'));
  }
};

const uploadPropertyImages = buildMulter({
  folder: 'properties',
  destDir: propertiesDir,
  nameFn: (file) => uniqueName(file.originalname),
  fileFilter: imageFilter,
});

const uploadSiteLogo = buildMulter({
  folder: 'site',
  destDir: siteDir,
  nameFn: (file) => `logo-${Date.now()}${path.extname(file.originalname).toLowerCase()}`,
  fileFilter: logoFilter,
});

const uploadSiteFavicon = buildMulter({
  folder: 'site',
  destDir: siteDir,
  nameFn: (file) => `favicon-${Date.now()}${path.extname(file.originalname).toLowerCase() || '.png'}`,
  fileFilter: faviconFilter,
  maxSizeBytes: 2 * 1024 * 1024,
});

const uploadSiteHero = buildMulter({
  folder: 'site',
  destDir: siteDir,
  nameFn: (file) => `hero-${Date.now()}${path.extname(file.originalname).toLowerCase()}`,
  fileFilter: imageFilter,
  maxSizeBytes: 8 * 1024 * 1024,
});

const uploadTeamPhoto = buildMulter({
  folder: 'team',
  destDir: teamDir,
  nameFn: (file) => `team-${Date.now()}${path.extname(file.originalname).toLowerCase()}`,
  fileFilter: imageFilter,
});

const pdfFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for floor plans'));
  }
};

const tourFilter = (_req, file, cb) => {
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only MP4, WebM, or MOV videos are allowed for virtual tours'));
  }
};

const uploadFloorPlan = buildMulter({
  folder: 'floorplans',
  destDir: floorplansDir,
  nameFn: (file) => `floorplan-${Date.now()}${path.extname(file.originalname).toLowerCase()}`,
  fileFilter: pdfFilter,
  maxSizeBytes: 20 * 1024 * 1024,
});

const uploadVirtualTour = buildMulter({
  folder: 'tours',
  destDir: toursDir,
  nameFn: (file) => `tour-${Date.now()}${path.extname(file.originalname).toLowerCase()}`,
  fileFilter: tourFilter,
  maxSizeBytes: 80 * 1024 * 1024,
});

module.exports = {
  uploadPropertyImages,
  uploadSiteLogo,
  uploadSiteFavicon,
  uploadSiteHero,
  uploadTeamPhoto,
  uploadFloorPlan,
  uploadVirtualTour,
  filePublicUrl,
  uploadRoot,
  propertiesDir,
  siteDir,
  teamDir,
  floorplansDir,
  toursDir,
  useS3,
};
