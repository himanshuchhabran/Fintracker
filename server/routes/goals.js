
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {authenticateToken} = require('../middlewares/auth');

// @route   POST /api/goals
// @desc    Create a new financial goal
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
    const { goal_name, target_amount, target_date } = req.body;
    const userId = req.user.user.id;

    if (!goal_name || !target_amount) {
        return res.status(400).json({ message: 'Goal name and target amount are required.' });
    }

    try {
        const newGoal = await pool.query(
            'INSERT INTO goals (user_id, goal_name, target_amount, target_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, goal_name, target_amount, target_date || null]
        );
        res.status(201).json(newGoal.rows[0]);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Server error while creating goal.' });
    }
});

// @route   GET /api/goals
// @desc    Get all of a user's financial goals
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.user.id;
    try {
        const goals = await pool.query(
            'SELECT * FROM goals WHERE user_id = $1 ORDER BY target_date ASC, created_at DESC',
            [userId]
        );
        res.json(goals.rows);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Server error while fetching goals.' });
    }
});

// @route   PUT /api/goals/:id/contribute
// @desc    Add savings to a goal
// @access  Private
router.put('/:id/contribute', authenticateToken, async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;
    const userId = req.user.user.id;

    if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'A valid contribution amount is required.' });
    }

    try {
        const updatedGoal = await pool.query(
            `UPDATE goals 
             SET current_amount = current_amount + $1 
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [amount, id, userId]
        );

        if (updatedGoal.rows.length === 0) {
            return res.status(404).json({ message: 'Goal not found or user not authorized.' });
        }
        res.json(updatedGoal.rows[0]);
    } catch (error) {
        console.error('Error contributing to goal:', error);
        res.status(500).json({ message: 'Server error while contributing to goal.' });
    }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a financial goal
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user.id;

    try {
        const deleteResult = await pool.query(
            'DELETE FROM goals WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Goal not found or user not authorized.' });
        }
        res.status(200).json({ message: 'Goal deleted successfully.' });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Server error while deleting goal.' });
    }
});


module.exports = router;