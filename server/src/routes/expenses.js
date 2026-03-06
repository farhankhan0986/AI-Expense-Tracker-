const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  uploadStatement,
} = require('../controllers/expenseController');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(auth);

router.get('/', getExpenses);

router.post(
  '/',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category')
      .optional()
      .isIn([
        'Food',
        'Transport',
        'Shopping',
        'Entertainment',
        'Bills',
        'Health',
        'Education',
        'Travel',
        'Other',
      ])
      .withMessage('Invalid category'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createExpense
);

router.get('/:id', getExpenseById);

router.put(
  '/:id',
  [
    body('amount')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('category')
      .optional()
      .isIn([
        'Food',
        'Transport',
        'Shopping',
        'Entertainment',
        'Bills',
        'Health',
        'Education',
        'Travel',
        'Other',
      ])
      .withMessage('Invalid category'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  updateExpense
);

router.delete('/:id', deleteExpense);

router.post('/upload', upload.single('file'), uploadStatement);

module.exports = router;
