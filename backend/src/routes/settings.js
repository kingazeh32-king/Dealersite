/**
 * Settings Routes
 *
 * PUBLIC ROUTES:
 *   GET  /api/settings                      - Get site settings
 *
 * ADMIN ROUTES (Protected):
 *   PUT  /api/settings                      - Update site settings
 *   POST /api/settings/logo                 - Upload site logo
 */

const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { uploadSiteLogo } = require('../utils/upload');
const settingsController = require('../controllers/settingsController');

const router = Router();

// ============= PUBLIC ROUTES =============
router.get('/', settingsController.get);

// ============= ADMIN ROUTES (Protected) =============
router.put(
  '/',
  authenticate,
  [
    body('site_name').optional().trim().notEmpty(),
    body('tagline').optional().trim(),
    body('logo_url').optional().trim(),
    body('contact_phone').optional().trim(),
    body('contact_email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Invalid email'),
    body('contact_address').optional().trim(),
    body('contact_city').optional().trim(),
    body('contact_hours').optional().trim(),
    body('hero_content').optional().isObject(),
    body('trust_signals').optional().isArray(),
    body('how_it_works').optional().isObject(),
    body('featured_homes_count').optional().isInt({ min: 0, max: 12 }),
    validate,
  ],
  settingsController.update
);

router.post(
  '/logo',
  authenticate,
  uploadSiteLogo.single('logo'),
  settingsController.uploadLogo
);

module.exports = router;
