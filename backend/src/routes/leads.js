/**
 * Leads Routes
 *
 * PUBLIC ROUTES:
 *   POST /api/leads                         - Submit a new lead (newsletter or pre-qualification)
 *
 * ADMIN ROUTES (Protected):
 *   GET  /api/leads/admin                   - List all leads
 */

const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const leadsController = require('../controllers/leadsController');

const router = Router();

const leadTypes = ['newsletter', 'prequalify'];

// ============= PUBLIC ROUTES =============
router.post(
  '/',
  [
    body('type').isIn(leadTypes).withMessage('Invalid lead type'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').if(body('type').equals('prequalify')).trim().notEmpty().withMessage('Name is required'),
    validate,
  ],
  leadsController.create
);

// ============= ADMIN ROUTES (Protected) =============
router.get('/admin', authenticate, leadsController.list);

module.exports = router;
