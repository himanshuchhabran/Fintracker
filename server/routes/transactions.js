
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {authenticateToken} = require('../middlewares/auth');

// @route   POST api/transactions
// @desc    Add a new transaction
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  const { amount, category, description, transaction_date } = req.body;
  const userId = req.user.user.id;

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

// @route   PUT api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { amount, category, description, transaction_date } = req.body;
    const userId = req.user.user.id;

    if (!amount || !category || !transaction_date) {
        return res.status(400).json({ message: 'Amount, category, and date are required.' });
    }

    try {
        const updatedTransaction = await pool.query(
            `UPDATE transactions 
             SET amount = $1, category = $2, description = $3, transaction_date = $4
             WHERE id = $5 AND user_id = $6
             RETURNING *`,
            [amount, category, description, transaction_date, id, userId]
        );

        if (updatedTransaction.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found or user not authorized.' });
        }

        res.json(updatedTransaction.rows[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server error while updating transaction.' });
    }
});

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user.id;

    try {
        const deleteResult = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Transaction not found or user not authorized.' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error while deleting transaction.' });
    }
});

module.exports = router;