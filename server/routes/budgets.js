const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/authenticateToken');

// @route   POST api/budgets
// @desc    Create or update a budget for a specific category and month
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
    const { category, limit_amount, month, year } = req.body;
    const userId = req.user.user.id;

    if (!category || !limit_amount || !month || !year) {
        return res.status(400).json({ message: 'Category, limit amount, month, and year are required.' });
    }

    try {
        // Using INSERT ... ON CONFLICT to handle both creation and updates seamlessly
        const newOrUpdatedBudget = await pool.query(
            `INSERT INTO budgets (user_id, category, limit_amount, month, year)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (user_id, category, month, year)
             DO UPDATE SET limit_amount = EXCLUDED.limit_amount
             RETURNING *`,
            [userId, category, limit_amount, month, year]
        );

        res.status(201).json(newOrUpdatedBudget.rows[0]);
    } catch (error) {
        console.error('Error setting budget:', error);
        res.status(500).json({ message: 'Server error while setting budget.' });
    }
});

// @route   GET api/budgets
// @desc    Get all budgets and current spending for a specific month and year
// @access  Private
router.get('/:year/:month', authenticateToken, async (req, res) => {
    const { year, month } = req.params;
    const userId = req.user.user.id;

    try {
        // This query joins the budgets table with an aggregation of transactions
        // to get the total spent for each category in the given month.
        const budgetsWithSpending = await pool.query(
            `SELECT
                b.id,
                b.category,
                b.limit_amount,
                COALESCE(t.total_spent, 0) as total_spent
             FROM budgets b
             LEFT JOIN (
                SELECT
                    category,
                    SUM(amount) as total_spent
                FROM transactions
                WHERE
                    user_id = $1 AND
                    EXTRACT(YEAR FROM transaction_date) = $2 AND
                    EXTRACT(MONTH FROM transaction_date) = $3
                GROUP BY category
             ) t ON b.category = t.category
             WHERE
                b.user_id = $1 AND
                b.year = $2 AND
                b.month = $3
             ORDER BY b.category`,
            [userId, year, month]
        );

        res.json(budgetsWithSpending.rows);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Server error while fetching budgets.' });
    }
});

module.exports = router;