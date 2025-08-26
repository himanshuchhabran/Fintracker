const nodemailer = require('nodemailer');

// Create a transporter object using Gmail SMTP
// This uses the credentials from your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be your 16-digit App Password
  },
});

/**
 * Sends an OTP email to the specified recipient.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The 6-digit one-time password.
 */
const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Mudra-Plan" <${process.env.EMAIL_USER}>`, // sender address
    to: to, // list of receivers
    subject: 'Your Mudra-Plan Verification Code', // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Mudra-Plan Email Verification</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 18px;">Your One-Time Password (OTP) is:</p>
          <p style="font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #059669; margin: 20px 0; background-color: #f0fdf4; padding: 10px; border-radius: 5px;">
            ${otp}
          </p>
          <p style="font-size: 16px;">This code is valid for <strong>10 minutes</strong>.</p>
          <p style="font-size: 14px; color: #777;">If you did not request this code, please ignore this email.</p>
        </div>
        <div style="background-color: #f8f8f8; color: #777; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">&copy; 2025 Mudra-Plan. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${to}:`, error);
    // In a real app, you might want to handle this more gracefully
    throw new Error('Could not send verification email.');
  }
};

module.exports = { sendOTPEmail };