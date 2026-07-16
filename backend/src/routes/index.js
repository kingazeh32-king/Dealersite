const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const authRoutes = require('./auth');
const propertiesRoutes = require('./properties');
const inquiriesRoutes = require('./inquiries');
const leadsRoutes = require('./leads');
const resourcesRoutes = require('./resources');
const faqsRoutes = require('./faqs');
const settingsRoutes = require('./settings');
const teamRoutes = require('./team');
const pagesRoutes = require('./pages');
const testimonialsRoutes = require('./testimonials');
const { uploadRoot } = require('../utils/upload');

const router = Router();

router.get('/health', (_req, res) => {
  let uploads = null;
  try {
    const siteDir = path.join(uploadRoot, 'site');
    uploads = {
      root: uploadRoot,
      exists: fs.existsSync(uploadRoot),
      folders: fs.existsSync(uploadRoot) ? fs.readdirSync(uploadRoot) : [],
      siteFiles: fs.existsSync(siteDir) ? fs.readdirSync(siteDir) : [],
    };
  } catch (err) {
    uploads = { root: uploadRoot, error: err.message };
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uploads,
  });
});

router.use('/auth', authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/inquiries', inquiriesRoutes);
router.use('/leads', leadsRoutes);
router.use('/resources', resourcesRoutes);
router.use('/faqs', faqsRoutes);
router.use('/settings', settingsRoutes);
router.use('/team', teamRoutes);
router.use('/pages', pagesRoutes);
router.use('/testimonials', testimonialsRoutes);

module.exports = router;
