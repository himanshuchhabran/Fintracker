
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../api';
const EditTransactionModal = ({ token, transaction, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    transaction_date: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || '',
        transaction_date: new Date(transaction.transaction_date).toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl(`transactions/${transaction.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update transaction');
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Edit Transaction</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number" name="amount" id="edit-amount" value={formData.amount}
              onChange={onChange} placeholder="0.00" required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category" id="edit-category" value={formData.category}
              onChange={onChange} required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edit-transaction_date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date" name="transaction_date" id="edit-transaction_date" value={formData.transaction_date}
              onChange={onChange} required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description" id="edit-description" value={formData.description}
              onChange={onChange} rows="3" placeholder="e.g., Lunch with colleagues"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 transition">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
