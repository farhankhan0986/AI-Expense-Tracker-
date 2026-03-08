const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { getBudgetLimits, setBudgetLimit } = require('../controllers/budgetController');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(auth);

router.get('/limits', getBudgetLimits);

router.post(
  '/limits',
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('limit').isFloat({ min: 0 }).withMessage('Limit must be a non-negative number'),
    body('month').optional().matches(/^\d{4}-\d{2}$/).withMessage('Month must be YYYY-MM'),
  ],
  validate,
  setBudgetLimit
);

module.exports = router;
