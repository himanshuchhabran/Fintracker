const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {authenticateToken} = require('../middlewares/auth');

// @route   GET api/dashboard/summary
// @desc    Get a summary of financial data for the dashboard
// @access  Private
router.get('/summary', authenticateToken, async (req, res) => {
    const userId = req.user.user.id;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    try {
        // 1. Get spending by category for the current month (for Pie Chart)
        const spendingByCategoryQuery = pool.query(
            `SELECT category, SUM(amount) as total
             FROM transactions
             WHERE user_id = $1 AND EXTRACT(YEAR FROM transaction_date) = $2 AND EXTRACT(MONTH FROM transaction_date) = $3
             GROUP BY category
             ORDER BY total DESC`,
            [userId, currentYear, currentMonth]
        );

        // 2. Get total spending for the last 6 months (for Bar Chart)
        const monthlySpendingQuery = pool.query(
            `SELECT 
                TO_CHAR(DATE_TRUNC('month', transaction_date), 'YYYY-MM') as month, 
                SUM(amount) as total
             FROM transactions
             WHERE user_id = $1 AND transaction_date >= DATE_TRUNC('month', NOW() - INTERVAL '5 months')
             GROUP BY DATE_TRUNC('month', transaction_date)
             ORDER BY month ASC`,
            [userId]
        );

        // Execute queries in parallel
        const [spendingByCategoryResult, monthlySpendingResult] = await Promise.all([
            spendingByCategoryQuery,
            monthlySpendingQuery,
        ]);

        res.json({
            spendingByCategory: spendingByCategoryResult.rows,
            monthlySpending: monthlySpendingResult.rows,
        });

    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Server error while fetching dashboard summary.' });
    }
});

module.exports = router;