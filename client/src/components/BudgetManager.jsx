import React, { useState } from 'react';

const BudgetProgressBar = ({ category, limit, spent }) => {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOverBudget = spent > limit;
    const barColor = isOverBudget ? 'bg-red-500' : 'bg-emerald-500';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                    ₹{spent.toFixed(0)} / ₹{limit.toFixed(0)}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const BudgetManager = ({ token, budgets, onSetBudget, currentDate }) => {
    const [category, setCategory] = useState('Food');
    const [limit, setLimit] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category,
                    limit_amount: parseFloat(limit),
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to set budget');
            onSetBudget(data);
            setLimit(''); // Clear input on success
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Budgets</h3>
            
            {/* Form to set a new budget */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 border-b pb-6">
                <div>
                    <label htmlFor="budget-category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="budget-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="budget-limit" className="block text-sm font-medium text-gray-700">Monthly Limit (₹)</label>
                    <input
                        id="budget-limit"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="e.g., 5000"
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400">
                    {isLoading ? 'Saving...' : 'Set Budget'}
                </button>
                {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
            </form>

            {/* List of existing budgets */}
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Current Month's Budgets</h4>
                {budgets.length > 0 ? (
                    budgets.map(budget => (
                        <BudgetProgressBar
                            key={budget.id}
                            category={budget.category}
                            limit={parseFloat(budget.limit_amount)}
                            spent={parseFloat(budget.total_spent)}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center">No budgets set for this month.</p>
                )}
            </div>
        </div>
    );
};

export default BudgetManager;
