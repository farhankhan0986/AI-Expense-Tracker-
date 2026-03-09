const express = require('express');
const protect = require('../middleware/auth');
const User = require('../models/User');
const Expense = require('../models/Expense');

const router = express.Router();

router.use(protect);

// GET /api/budget/limits
// Get category budget limits
router.get('/limits', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Convert Map to plain object
    const limits = user.categoryBudgets ? Object.fromEntries(user.categoryBudgets) : {};
    
    res.json({ limits });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching budget limits' });
  }
});

// POST /api/budget/limits
// Set a category budget limit
router.post('/limits', async (req, res) => {
  try {
    const { category, limit } = req.body;
    if (!category || typeof limit !== 'number') {
      return res.status(400).json({ error: 'Please provide category and limit amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Initialize map if it doesn't exist
    if (!user.categoryBudgets) {
      user.categoryBudgets = new Map();
    }
    
    user.categoryBudgets.set(category, limit);
    await user.save();
    
    const limits = Object.fromEntries(user.categoryBudgets);
    res.json({ limits });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating budget limit' });
  }
});

module.exports = router;
