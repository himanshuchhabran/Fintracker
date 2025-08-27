
import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetManager from '../components/BudgetManager';

const Dashboard = ({ onLogout, token }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    try {
      const [transRes, budgRes] = await Promise.all([
        fetch(`/api/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/budgets/${year}/${month}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!transRes.ok || !budgRes.ok) {
        throw new Error('Failed to fetch dashboard data.');
      }

      const transData = await transRes.json();
      const budgData = await budgRes.json();
      
      setTransactions(transData);
      setBudgets(budgData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, currentDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDataUpdate = () => {
    fetchDashboardData();
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
          {/* --- THIS IS THE FIX --- */}
          {/* I've added the `space-y-8` class here to create vertical spacing */}
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm token={token} onAddTransaction={handleDataUpdate} />
            <BudgetManager token={token} budgets={budgets} onSetBudget={handleDataUpdate} currentDate={currentDate} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
