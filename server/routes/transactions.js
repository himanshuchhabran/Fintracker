const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Assuming you have a db config file
const {authenticateToken} = require('../middlewares/auth');

// @route   POST api/transactions
// @desc    Add a new transaction
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  const { amount, category, description, transaction_date } = req.body;
  const userId = req.user.user.id;

  // Basic validation
  if (!amount || !category || !transaction_date) {
    return res.status(400).json({ message: 'Amount, category, and date are required.' });
  }

  try {
    const newTransaction = await pool.query(
      'INSERT INTO transactions (user_id, amount, category, description, transaction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, category, description, transaction_date]
    );

    res.status(201).json(newTransaction.rows[0]);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Server error while adding transaction.' });
  }
});

// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.user.id;

  try {
    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC, created_at DESC',
      [userId]
    );

    res.json(transactions.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions.' });
  }
});

module.exports = router;