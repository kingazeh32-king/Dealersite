/**
 * Inquiries Routes
 *
 * PUBLIC ROUTES:
 *   POST /api/inquiries                     - Submit a new inquiry
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/inquiries/admin               - List all inquiries
 *   PATCH /api/inquiries/admin/:id/status   - Update inquiry status
 */

const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const inquiriesController = require('../controllers/inquiriesController');

const router = Router();

const inquiryTypes = ['general', 'property', 'service', 'financing'];
const inquiryStatuses = ['new', 'read', 'resolved'];

// ============= PUBLIC ROUTES =============
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email required'),
    body('phone').optional({ values: 'falsy' }).isLength({ min: 7 }).withMessage('Valid phone required'),
    body().custom((_, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error('Email or phone is required');
      }
      return true;
    }),
    body('inquiry_type').optional().isIn(inquiryTypes),
    body('property_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
    validate,
  ],
  inquiriesController.create
);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin', authenticate, inquiriesController.list);

router.patch(
  '/admin/:id/status',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('status').isIn(inquiryStatuses).withMessage('Invalid status'),
    validate,
  ],
  inquiriesController.updateStatus
);

module.exports = router;
