const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const { month } = req.query; // e.g. "2026-03"
    if (!month) {
      return res.status(400).json({ error: 'Month query parameter is required (YYYY-MM).' });
    }

    const [year, mon] = month.split('-').map(Number);
    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 0, 23, 59, 59, 999);

    const breakdown = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalSpent = breakdown.reduce((sum, cat) => sum + cat.total, 0);

    res.json({
      month,
      totalSpent,
      breakdown: breakdown.map((b) => ({
        category: b._id,
        total: b.total,
        count: b.count,
        percentage: totalSpent > 0 ? Math.round((b.total / totalSpent) * 100) : 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics.', details: err.message });
  }
};

exports.getSpendingTrend = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const trend = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.json({
      trend: trend.map((t) => ({
        month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
        total: t.total,
        count: t.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends.', details: err.message });
  }
};

exports.getSavingSuggestions = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [currentMonth, lastMonth] = await Promise.all([
      Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user.id), date: { $gte: startOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user.id),
            date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
    ]);

    const suggestions = [];
    const currentMap = Object.fromEntries(currentMonth.map((c) => [c._id, c]));
    const lastMap = Object.fromEntries(lastMonth.map((c) => [c._id, c]));

    const currentTotal = currentMonth.reduce((s, c) => s + c.total, 0);

    // Check for categories with high spending
    for (const cat of currentMonth) {
      const pct = currentTotal > 0 ? (cat.total / currentTotal) * 100 : 0;
      if (pct > 30) {
        suggestions.push({
          type: 'high_spending',
          category: cat._id,
          message: `${cat._id} accounts for ${Math.round(pct)}% of your spending this month. Consider setting a stricter budget for this category.`,
          amount: cat.total,
        });
      }
    }

    // Check for increased spending vs last month
    for (const [category, current] of Object.entries(currentMap)) {
      const last = lastMap[category];
      if (last && current.total > last.total * 1.2) {
        const increase = Math.round(((current.total - last.total) / last.total) * 100);
        suggestions.push({
          type: 'spending_increase',
          category,
          message: `Your ${category} spending increased by ${increase}% compared to last month. Review recent ${category.toLowerCase()} expenses for potential savings.`,
          currentAmount: current.total,
          previousAmount: last.total,
        });
      }
    }

    // Check for frequent small purchases
    for (const cat of currentMonth) {
      const avgAmount = cat.total / cat.count;
      if (cat.count > 10 && avgAmount < 20) {
        suggestions.push({
          type: 'frequent_small_purchases',
          category: cat._id,
          message: `You have ${cat.count} small ${cat._id.toLowerCase()} purchases this month averaging $${avgAmount.toFixed(2)}. These add up to $${cat.total.toFixed(2)}. Try batching purchases to reduce impulse spending.`,
          count: cat.count,
          total: cat.total,
        });
      }
    }

    // Subscription and entertainment check
    const entertainmentSpending = currentMap['Entertainment'];
    if (entertainmentSpending && entertainmentSpending.total > currentTotal * 0.15) {
      suggestions.push({
        type: 'entertainment_review',
        category: 'Entertainment',
        message: `Entertainment spending is $${entertainmentSpending.total.toFixed(2)} this month. Review streaming subscriptions and memberships for unused services.`,
        amount: entertainmentSpending.total,
      });
    }

    // Food spending tip
    const foodSpending = currentMap['Food'];
    if (foodSpending && foodSpending.count > 15) {
      suggestions.push({
        type: 'food_tip',
        category: 'Food',
        message: `You have ${foodSpending.count} food expenses this month totaling $${foodSpending.total.toFixed(2)}. Meal prepping could save 30-40% on food costs.`,
        count: foodSpending.count,
        amount: foodSpending.total,
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'general',
        message: 'Your spending looks well-balanced. Keep tracking expenses to maintain good financial habits!',
      });
    }

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate suggestions.', details: err.message });
  }
};

exports.getBudgetAlerts = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [budgets, spending] = await Promise.all([
      Budget.find({ userId: req.user.id, month: currentMonth }),
      Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user.id), date: { $gte: startOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
    ]);

    const spendingMap = Object.fromEntries(spending.map((s) => [s._id, s.total]));
    const alerts = [];

    for (const budget of budgets) {
      const spent = spendingMap[budget.category] || 0;
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      if (percentage >= 100) {
        alerts.push({
          severity: 'critical',
          category: budget.category,
          message: `You have exceeded your ${budget.category} budget! Spent $${spent.toFixed(2)} of $${budget.limit.toFixed(2)} limit (${Math.round(percentage)}%).`,
          spent,
          limit: budget.limit,
          percentage: Math.round(percentage),
        });
      } else if (percentage >= 80) {
        alerts.push({
          severity: 'warning',
          category: budget.category,
          message: `You are approaching your ${budget.category} budget limit. Spent $${spent.toFixed(2)} of $${budget.limit.toFixed(2)} (${Math.round(percentage)}%).`,
          spent,
          limit: budget.limit,
          percentage: Math.round(percentage),
        });
      }
    }

    alerts.sort((a, b) => b.percentage - a.percentage);

    res.json({ month: currentMonth, alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget alerts.', details: err.message });
  }
};

exports.getDailyAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29); // 30 days inclusive of today
    
    // Set to beginning of the day for strict matching
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const daily = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    // Build a contiguous 30-day map, so days with 0 spend are properly represented
    const resultsMap = {};
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        resultsMap[key] = 0;
    }

    // Populate actual spending
    daily.forEach(d => {
        const key = `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`;
        if (resultsMap[key] !== undefined) {
           resultsMap[key] = d.total;
        }
    });

    const output = Object.keys(resultsMap).map(k => ({
        date: k,
        total: resultsMap[k]
    }));

    res.json({ timeline: output });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily analytics.', details: err.message });
  }
};
