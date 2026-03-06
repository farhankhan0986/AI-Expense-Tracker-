const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, monthlyBudget } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, monthlyBudget });
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.', details: err.message });
  }
};
