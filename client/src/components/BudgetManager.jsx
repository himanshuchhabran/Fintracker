// client/src/components/BudgetManager.jsx (UPDATED & FIXED)

import React, { useState, useMemo } from 'react';
import { getApiUrl } from '../api';
import EditBudgetModal from './EditBudgetModal';

// Sub-component for displaying a single budget's progress
const BudgetProgressBar = ({ category, limit, spent, onEdit, onDelete }) => {
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const isOverBudget = spent > limit;
    const barColor = isOverBudget ? 'bg-red-500' : 'bg-emerald-500';

    return (
        <div className="group space-y-1">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                        ₹{spent.toFixed(0)} / ₹{limit.toFixed(0)}
                    </span>
                    <div className="flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={onEdit} title="Edit Budget" className="p-0.5 rounded hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                            </svg>
                        </button>
                        <button onClick={onDelete} title="Delete Budget" className="p-0.5 rounded hover:bg-gray-200">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


const BudgetManager = ({ token, budgets, onBudgetUpdate, currentDate, transactions }) => {
    const [category, setCategory] = useState('Food');
    const [limit, setLimit] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

    // Calculate total spending per category for the current month
    const spendingMap = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            const transactionMonth = new Date(t.transaction_date).getMonth();
            const transactionYear = new Date(t.transaction_date).getFullYear();
            if (transactionMonth === currentDate.getMonth() && transactionYear === currentDate.getFullYear()) {
                if (!map[t.category]) {
                    map[t.category] = 0;
                }
                map[t.category] += parseFloat(t.amount);
            }
        });
        return map;
    }, [transactions, currentDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // This POST route on the backend is designed to handle both create and update (upsert)
            const res = await fetch(getApiUrl('/budgets'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    category,
                    limit_amount: parseFloat(limit),
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to set budget');
            onBudgetUpdate();
            setLimit('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) return;
        try {
            const res = await fetch(getApiUrl(`/budgets/${id}`), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete budget');
            onBudgetUpdate();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Budgets</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 mb-6 border-b pb-6">
                    <div>
                        <label htmlFor="budget-category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="budget-category" value={category} onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="budget-limit" className="block text-sm font-medium text-gray-700">Monthly Limit (₹)</label>
                        <input
                            id="budget-limit" type="number" value={limit} onChange={(e) => setLimit(e.target.value)}
                            placeholder="e.g., 5000" required min="0" step="0.01"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                        {isLoading ? 'Saving...' : 'Set / Update Budget'}
                    </button>
                    {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
                </form>

                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Current Month's Budgets</h4>
                    {budgets.length > 0 ? (
                        budgets.map(budget => (
                            <BudgetProgressBar
                                key={budget.id}
                                category={budget.category}
                                limit={parseFloat(budget.limit_amount)}
                                spent={spendingMap[budget.category] || 0}
                                onEdit={() => setEditingBudget(budget)}
                                onDelete={() => handleDelete(budget.id)}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No budgets set for this month.</p>
                    )}
                </div>
            </div>
            {editingBudget && (
                <EditBudgetModal
                    token={token}
                    budget={editingBudget}
                    onClose={() => setEditingBudget(null)}
                    onUpdate={() => {
                        onBudgetUpdate();
                        setEditingBudget(null);
                    }}
                />
            )}
        </>
    );
};

export default BudgetManager;
