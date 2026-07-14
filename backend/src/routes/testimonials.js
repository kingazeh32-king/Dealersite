const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const testimonialsController = require('../controllers/testimonialsController');

const router = Router();

router.get('/', testimonialsController.list);
router.get('/admin/all', authenticate, testimonialsController.list);

router.get('/admin/:id', authenticate, [param('id').isInt({ min: 1 }), validate], testimonialsController.getById);

router.post(
  '/admin',
  authenticate,
  [
    body('quote').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('sort_order').optional().isInt({ min: 0 }),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  testimonialsController.create
);

router.put(
  '/admin/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('quote').optional().trim().notEmpty(),
    body('name').optional().trim().notEmpty(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('sort_order').optional().isInt({ min: 0 }),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  testimonialsController.update
);

router.delete(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  testimonialsController.remove
);

module.exports = router;
