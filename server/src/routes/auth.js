const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

module.exports = router;
