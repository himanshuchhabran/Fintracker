import React, { useState } from 'react';

const Register = ({ onSwitchForm }) => {
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage('Registration successful! You can now log in.');
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage('Server error. Please try again later.');
      console.error(err);
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
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200"
        >
          Register
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm text-center font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
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