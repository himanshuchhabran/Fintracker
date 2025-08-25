const express = require("express");
const router = express.Router();

const {login,signup} = require("../controllers/Auth");
const {authenticateToken} = require("../middlewares/auth");
router.post("/auth/login",login);
router.post("/auth/register",signup);


router.get('/dashboard', authenticateToken, (req, res) => {
  // Because of the middleware, this will only be accessible with a valid token.
  // The user's info from the token is available in req.user
  res.json({
    message: `Welcome to your dashboard, ${req.user.user.email}!`,
    data: 'This is protected data.',
  });
});
module.exports = router;