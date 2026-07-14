const { Router } = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { validate } = require('../middleware/validate');
const { authenticate, loadAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = Router();

// Rate limiters for auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per windowMs
  message: 'Too many password reset requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordRules = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters');

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login
);

router.get('/me', authenticate, loadAdmin, authController.me);

router.post(
  '/change-password',
  authenticate,
  loadAdmin,
  [
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
    validate,
  ],
  authController.changePassword
);

router.post(
  '/change-email',
  authenticate,
  loadAdmin,
  [
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_email').isEmail().withMessage('Valid email is required'),
    validate,
  ],
  authController.changeEmail
);

router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    validate,
  ],
  authController.forgotPassword
);

router.post(
  '/reset-password',
  forgotPasswordLimiter,
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    passwordRules,
    validate,
  ],
  authController.resetPassword
);

module.exports = router;
