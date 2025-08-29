
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {authenticateToken} = require('../middlewares/auth');
const axios = require('axios'); // Import axios

// @route   POST api/risk/submit
// @desc    Submit answers, get profile, and fetch recommendations
// @access  Private
router.post('/submit', authenticateToken, async (req, res) => {
    const { answers } = req.body;
    const userId = req.user.user.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: 'Valid answers are required.' });
    }

    // 1. Calculate the risk profile (same as before)
    const score = answers.reduce((acc, val) => acc + val, 0);
    let profile = "Conservative";
    if (score >= 10 && score <= 15) profile = "Moderate";
    else if (score > 15) profile = "Aggressive";

    try {
        // 2. Update the user's profile in our database
        await pool.query(
            'UPDATE users SET risk_profile = $1 WHERE id = $2',
            [profile, userId]
        );

        // 3. Call the Python AI service to get recommendations
        const aiServiceResponse = await axios.post('http://ai_service:8000/api/recommendations', {
            risk_profile: profile
        });

        // 4. Combine the results and send back to the frontend
        res.status(200).json({
            risk_profile: profile,
            score: score,
            recommendations: aiServiceResponse.data
        });

    } catch (error) {
        console.error('Error in risk submission process:', error.message);
        // Differentiate between our server error and the AI service being down
        if (error.response) {
            return res.status(502).json({ message: 'Could not fetch recommendations from AI service.' });
        }
        res.status(500).json({ message: 'Server error while updating risk profile.' });
    }
});

module.exports = router;