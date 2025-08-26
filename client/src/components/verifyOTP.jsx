import React, { useState } from 'react';

const VerifyOTP = ({ email, onVerificationSuccess }) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setTimeout(() => {
          onVerificationSuccess();
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Verification failed.');
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage('Server error. Please try again later.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
      <p className="text-gray-600 mb-8">
        An OTP has been sent to <strong>{email}</strong>. Please enter it below.
      </p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            6-Digit OTP
          </label>
          <input
            id="otp"
            type="text"
            placeholder="123456"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition text-center tracking-[8px]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 disabled:bg-emerald-400"
        >
          {isLoading ? 'Verifying...' : 'Verify Account'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm text-center font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyOTP;