
import React, { useState } from 'react';

const ContributeModal = ({ token, goal, onClose, onUpdate }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch(`/api/goals/${goal.id}/contribute`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to contribute.');
            onUpdate();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!goal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Contribute to "{goal.goal_name}"</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Contribution Amount (₹)</label>
                        <input type="number" name="amount" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                        <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 transition">
                            {isLoading ? 'Saving...' : 'Add Contribution'}
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ContributeModal;