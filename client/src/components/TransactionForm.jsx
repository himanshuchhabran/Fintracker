import React, { useState } from 'react';

const TransactionForm = ({ token, onAddTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food', // Default category
    description: '',
    transaction_date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { amount, category, description, transaction_date } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(amount) // Ensure amount is a number
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add transaction');
      }
      
      onAddTransaction(data); // Update parent state
      
      // Reset form to initial state
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Expense</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={onChange}
            placeholder="0.00"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={onChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="transaction_date"
            id="transaction_date"
            value={transaction_date}
            onChange={onChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
            rows="3"
            placeholder="e.g., Lunch with colleagues"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200 disabled:bg-emerald-400"
        >
          {isLoading ? 'Adding...' : 'Add Expense'}
        </button>
        {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;