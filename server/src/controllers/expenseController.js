const { parse } = require('csv-parse/sync');
const Expense = require('../models/Expense');
const { classifyExpense } = require('../utils/classifier');

exports.createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    let finalCategory = category;
    let isAutoClassified = false;

    if (!category) {
      finalCategory = await classifyExpense(description);
      isAutoClassified = true;
    }

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      description,
      category: finalCategory,
      date: date || Date.now(),
      isAutoClassified,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense.', details: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user.id };

    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Expense.countDocuments(filter),
    ]);

    res.json({
      expenses,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses.', details: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expense.', details: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { amount, description, category, date },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update expense.', details: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense.', details: err.message });
  }
};

exports.uploadStatement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded.' });
    }

    const csvContent = req.file.buffer.toString('utf-8');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const parsed = [];

    for (const record of records) {
      const description = record.description || record.Description || '';
      const amount = parseFloat(record.amount || record.Amount || 0);
      const dateStr = record.date || record.Date || null;

      if (!description || isNaN(amount) || amount <= 0) continue;

      parsed.push({ description, amount, date: dateStr ? new Date(dateStr) : new Date() });
    }

    const categories = await Promise.all(
      parsed.map((r) => classifyExpense(r.description))
    );

    const expenses = parsed.map((r, i) => ({
      userId: req.user.id,
      amount: r.amount,
      description: r.description,
      category: categories[i],
      date: r.date,
      isAutoClassified: true,
    }));

    const created = await Expense.insertMany(expenses);

    res.status(201).json({
      message: `${created.length} expenses imported successfully.`,
      count: created.length,
      expenses: created,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process CSV.', details: err.message });
  }
};
