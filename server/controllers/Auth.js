const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { sendOTPEmail } = require("../services/emailService");

// Register new user
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set OTP expiry time to 10 minutes from now
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Insert into DB
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash,otp, otp_expires_at) VALUES ($1, $2, $3, $4) RETURNING id, email",
      [email, passwordHash, otp, otpExpiresAt]
    );

     // Send the OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "User created successfully. Please check your email for an OTP.",
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "23505") {
      // Duplicate email
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please login instead."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration."
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check user
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

exports.verifyOTP = async (req,res)=>{
   const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // OTP is correct, mark user as verified and clear OTP fields
        await pool.query(
            'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE email = $1',
            [email]
        );

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};