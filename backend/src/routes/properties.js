/**
 * Properties Routes
 *
 * PUBLIC ROUTES:
 *   GET  /api/properties                    - List all available properties
 *   GET  /api/properties/featured           - Get featured properties
 *   GET  /api/properties/:slug              - Get property by slug
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/properties/admin/all          - List all properties (admin dashboard)
 *   POST /api/properties/admin              - Create new property
 *   PUT  /api/properties/admin/:id          - Update property
 *   PATCH /api/properties/admin/:id/status  - Update property status
 *   DELETE /api/properties/admin/:id        - Delete property
 *   POST /api/properties/admin/:id/images   - Upload property images
 *   PUT  /api/properties/admin/:id/images   - Update property image order/info
 */

const { Router } = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  uploadPropertyImages,
  uploadFloorPlan,
  uploadVirtualTour,
} = require('../utils/upload');
const propertiesController = require('../controllers/propertiesController');

const router = Router();

const categories = ['new', 'pre-owned', 'tiny'];
const statuses = ['available', 'pending', 'sold'];

// ============= PUBLIC ROUTES =============
router.get(
  '/',
  [
    query('category').optional().isIn(categories),
    query('status').optional().isIn(statuses),
    query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', 'featured']),
    validate,
  ],
  propertiesController.list
);

router.get('/featured', propertiesController.featured);

router.get('/:slug', propertiesController.getBySlug);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin/all', authenticate, [
  query('category').optional().isIn(categories),
  query('status').optional().isIn(statuses),
  query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', 'featured']),
  validate,
], propertiesController.list);

router.post(
  '/admin',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').isIn(categories).withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('status').optional().isIn(statuses),
    validate,
  ],
  propertiesController.create
);

router.put(
  '/admin/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('category').optional().isIn(categories),
    body('status').optional().isIn(statuses),
    body('price').optional().isFloat({ min: 0 }),
    validate,
  ],
  propertiesController.update
);

router.patch(
  '/admin/:id/status',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('status').isIn(statuses).withMessage('Invalid status'),
    validate,
  ],
  propertiesController.updateStatus
);

router.delete(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  propertiesController.remove
);

router.post(
  '/admin/:id/images',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  uploadPropertyImages.array('images', 10),
  propertiesController.uploadImages
);

router.put(
  '/admin/:id/images',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('images').isArray().withMessage('images must be an array'),
    validate,
  ],
  propertiesController.updateImages
);

router.post(
  '/admin/:id/floorplan',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  uploadFloorPlan.single('floorplan'),
  propertiesController.uploadFloorPlan
);

router.post(
  '/admin/:id/virtual-tour',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  uploadVirtualTour.single('virtual_tour'),
  propertiesController.uploadVirtualTour
);

module.exports = router;
