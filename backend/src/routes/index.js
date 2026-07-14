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
const debugRoutes = require('./debug');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Debug routes (temporary)
router.use('/debug', debugRoutes);

module.exports = router;
