import React, { useState } from 'react';
import { getApiUrl } from '../api';

const Register = ({ onRegisterSuccess, onSwitchForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onRegisterSuccess(email);
      } else {
        setIsError(true);
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Server error. Please try again later.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
      <p className="text-gray-600 mb-8">Get started with your financial journey.</p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email-register"
            type="email"
            placeholder="you@example.com"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password-register"
            type="password"
            placeholder="••••••••"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 disabled:bg-emerald-400"
        >
          {isLoading ? 'Sending OTP...' : 'Register'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm text-center font-medium ${isError ? 'text-red-600' : ''}`}>
          {message}
        </p>
      )}
      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account?{' '}
        <button onClick={onSwitchForm} className="font-medium text-emerald-600 hover:underline">
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;