const Budget = require('../models/Budget');

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

exports.getBudgetLimits = async (req, res) => {
  try {
    const month = req.query.month || getCurrentMonth();
    const budgets = await Budget.find({ userId: req.user.id, month }).lean();

    const limits = budgets.reduce((acc, b) => {
      acc[b.category] = b.limit;
      return acc;
    }, {});

    res.json({ month, limits });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget limits.', details: err.message });
  }
};

exports.setBudgetLimit = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || typeof limit !== 'number' || Number.isNaN(limit) || limit < 0) {
      return res.status(400).json({ error: 'Valid category and non-negative numeric limit are required.' });
    }

    const targetMonth = month || getCurrentMonth();

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month: targetMonth, category },
      { $set: { limit } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.status(201).json({ message: 'Budget limit saved.', budget });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budget limit.', details: err.message });
  }
};
