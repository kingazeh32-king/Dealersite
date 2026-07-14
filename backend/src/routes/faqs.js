/**
 * FAQs Routes
 *
 * PUBLIC ROUTES:
 *   GET  /api/faqs                          - List all published FAQs
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/faqs/admin/all                - List all FAQs (admin dashboard)
 *   GET  /api/faqs/admin/:id                - Get FAQ by ID
 *   POST /api/faqs/admin                    - Create new FAQ
 *   PUT  /api/faqs/admin/:id                - Update FAQ
 *   DELETE /api/faqs/admin/:id              - Delete FAQ
 */

const { Router } = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const faqsController = require('../controllers/faqsController');

const router = Router();
const faqCategories = ['general', 'financing', 'delivery', 'installation', 'buying'];

// ============= PUBLIC ROUTES =============
router.get(
  '/',
  [query('category').optional().isIn(faqCategories), validate],
  faqsController.list
);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin/all', authenticate, faqsController.list);

router.get(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  faqsController.getById
);

router.post(
  '/admin',
  authenticate,
  [
    body('question').trim().notEmpty(),
    body('answer').trim().notEmpty(),
    body('category').isIn(faqCategories),
    body('sort_order').optional().isInt({ min: 0 }),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  faqsController.create
);

router.put(
  '/admin/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('question').optional().trim().notEmpty(),
    body('answer').optional().trim().notEmpty(),
    body('category').optional().isIn(faqCategories),
    body('sort_order').optional().isInt({ min: 0 }),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  faqsController.update
);

router.delete(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  faqsController.remove
);

module.exports = router;
