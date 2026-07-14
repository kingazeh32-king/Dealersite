/**
 * Resources Routes
 *
 * PUBLIC ROUTES:
 *   GET  /api/resources                     - List all published resources
 *   GET  /api/resources/:slug               - Get resource by slug
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/resources/admin/all           - List all resources (admin dashboard)
 *   GET  /api/resources/admin/:id           - Get resource by ID
 *   POST /api/resources/admin               - Create new resource
 *   PUT  /api/resources/admin/:id           - Update resource
 *   DELETE /api/resources/admin/:id         - Delete resource
 */

const { Router } = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const resourcesController = require('../controllers/resourcesController');

const router = Router();
const resourceTypes = ['buying-guide', 'permit', 'maintenance', 'general'];

// ============= PUBLIC ROUTES =============
router.get(
  '/',
  [query('type').optional().isIn(resourceTypes), validate],
  resourcesController.list
);

router.get('/:slug', resourcesController.getBySlug);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin/all', authenticate, resourcesController.list);

router.get(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  resourcesController.getById
);

router.post(
  '/admin',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('type').isIn(resourceTypes),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  resourcesController.create
);

router.put(
  '/admin/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('title').optional().trim().notEmpty(),
    body('type').optional().isIn(resourceTypes),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  resourcesController.update
);

router.delete(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  resourcesController.remove
);

module.exports = router;
