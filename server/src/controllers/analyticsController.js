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
    const days = Math.min(Math.max(parseInt(req.query.days || '14', 10), 7), 60);
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const start = new Date(now);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const byDay = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: start, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const totalsMap = new Map(
      byDay.map((d) => {
        const date = `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`;
        return [date, { total: d.total, count: d.count }];
      })
    );

    const daily = [];
    const cursor = new Date(start);

    while (cursor <= now) {
      const key = cursor.toISOString().slice(0, 10);
      const found = totalsMap.get(key) || { total: 0, count: 0 };
      daily.push({ date: key, total: found.total, count: found.count });
      cursor.setDate(cursor.getDate() + 1);
    }

    const avgDailySpend = daily.reduce((sum, d) => sum + d.total, 0) / daily.length;
    const last7 = daily.slice(-7).reduce((sum, d) => sum + d.total, 0);
    const previous7 = daily.slice(-14, -7).reduce((sum, d) => sum + d.total, 0);
    const weeklyDelta = previous7 > 0 ? ((last7 - previous7) / previous7) * 100 : 0;

    const forecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toISOString().slice(0, 10),
        projectedTotal: Number(avgDailySpend.toFixed(2)),
      };
    });

    const recommendations = [];
    if (weeklyDelta > 15) {
      recommendations.push('Daily spending is trending upward this week. Consider reducing discretionary categories.');
    }
    if (avgDailySpend > 0 && last7 / 7 > avgDailySpend * 1.1) {
      recommendations.push('Recent 7-day average is above your baseline. Enable tighter budget notifications.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Spending momentum is stable. Keep current budget allocations and monitor anomalies.');
    }

    res.json({
      windowDays: days,
      summary: {
        avgDailySpend: Number(avgDailySpend.toFixed(2)),
        totalWindowSpend: Number(daily.reduce((sum, d) => sum + d.total, 0).toFixed(2)),
        weeklyDelta: Number(weeklyDelta.toFixed(1)),
      },
      daily,
      forecast,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily analytics.', details: err.message });
  }
};
