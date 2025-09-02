
import React, { useState } from 'react';
import { getApiUrl } from '../api';

const Login = ({ onSwitchForm,onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setMessage('');
    try {
      // Use the helper to get the correct API URL
      const res = await fetch(getApiUrl('auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsSuccess(true);
        setMessage('Login successful! Redirecting...');
        onLoginSuccess(data.token);
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage('Server error. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
      <p className="text-gray-600 mb-8">Please enter your details to sign in.</p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email-login"
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
          <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password-login"
            type="password"
            placeholder="••••••••"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200"
        >
          Login
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm text-center font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <p className="text-center text-sm text-gray-600 mt-8">
        Don't have an account?{' '}
        <button onClick={onSwitchForm} className="font-medium text-emerald-600 hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
