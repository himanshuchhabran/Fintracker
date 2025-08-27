
import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

const Dashboard = ({ onLogout, token }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Using useCallback to memoize the fetch function
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch transactions on initial component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // This handler is passed to the form to update the UI instantly
  const handleAddTransaction = (newTransaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Mudra-Plan</h1>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Add Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm token={token} onAddTransaction={handleAddTransaction} />
          </div>
          {/* Right Column: Transaction List */}
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;