const mongoose = require('mongoose');
const { CATEGORIES } = require('./Expense');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: CATEGORIES,
    required: [true, 'Category is required'],
  },
  limit: {
    type: Number,
    required: [true, 'Budget limit is required'],
    min: [0, 'Limit must be positive'],
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

budgetSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
