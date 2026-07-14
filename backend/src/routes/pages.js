/**
 * Pages Routes
 *
 * PUBLIC ROUTES:
 *   GET  /api/pages/:slug                   - Get page content by slug (about, financing)
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/pages/admin/all               - List all pages (admin dashboard)
 *   PUT  /api/pages/admin/:slug             - Update page content
 */

const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const pagesController = require('../controllers/pagesController');

const router = Router();
const slugs = ['about', 'financing', 'privacy-policy', 'terms'];

// ============= PUBLIC ROUTES =============
router.get(
  '/:slug',
  [param('slug').isIn(slugs), validate],
  pagesController.getBySlug
);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin/all', authenticate, pagesController.list);
router.put('/admin/:slug', authenticate, pagesController.update);

module.exports = router;
