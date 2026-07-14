const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { upload } = require('../config/env');

const uploadRoot = path.resolve(process.cwd(), upload.dir);
const propertiesDir = path.join(uploadRoot, 'properties');

if (!fs.existsSync(propertiesDir)) {
  fs.mkdirSync(propertiesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, propertiesDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
  }
};

const uploadPropertyImages = multer({
  storage,
  limits: { fileSize: upload.maxSizeBytes },
  fileFilter: imageFilter,
});

const siteDir = path.join(uploadRoot, 'site');

if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir, { recursive: true });
}

const siteStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, siteDir),
  filename: (_req, file, cb) => {
    const unique = `logo-${Date.now()}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, unique);
  },
});

const logoFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, GIF, and SVG images are allowed'));
  }
};

const uploadSiteLogo = multer({
  storage: siteStorage,
  limits: { fileSize: upload.maxSizeBytes },
  fileFilter: logoFilter,
});

const teamDir = path.join(uploadRoot, 'team');

if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

const teamStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, teamDir),
  filename: (_req, file, cb) => {
    const unique = `team-${Date.now()}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, unique);
  },
});

const uploadTeamPhoto = multer({
  storage: teamStorage,
  limits: { fileSize: upload.maxSizeBytes },
  fileFilter: imageFilter,
});

module.exports = {
  uploadPropertyImages,
  uploadSiteLogo,
  uploadTeamPhoto,
  propertiesDir,
  siteDir,
  teamDir,
};
