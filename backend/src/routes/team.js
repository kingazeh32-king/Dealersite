/**
 * Team Routes
 *
 * PUBLIC ROUTES:
 *   GET  /api/team                          - List all published team members
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/team/admin/all                - List all team members (admin dashboard)
 *   GET  /api/team/admin/:id                - Get team member by ID
 *   POST /api/team/admin                    - Create new team member
 *   PUT  /api/team/admin/:id                - Update team member
 *   DELETE /api/team/admin/:id              - Delete team member
 */

const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { uploadTeamPhoto } = require('../utils/upload');
const teamController = require('../controllers/teamController');

const router = Router();

// ============= PUBLIC ROUTES =============
router.get('/', teamController.list);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin/all', authenticate, teamController.list);

router.get(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  teamController.getById
);

router.post(
  '/admin',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('email').optional({ values: 'falsy' }).trim().isEmail(),
    body('sort_order').optional().isInt({ min: 0 }),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  teamController.create
);

router.put(
  '/admin/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().notEmpty(),
    body('role').optional().trim().notEmpty(),
    body('email').optional({ values: 'falsy' }).trim().isEmail(),
    body('sort_order').optional().isInt({ min: 0 }),
    body('is_published').optional().isBoolean(),
    validate,
  ],
  teamController.update
);

router.delete(
  '/admin/:id',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  teamController.remove
);

router.post(
  '/admin/:id/photo',
  authenticate,
  [param('id').isInt({ min: 1 }), validate],
  uploadTeamPhoto.single('photo'),
  teamController.uploadPhoto
);

module.exports = router;
