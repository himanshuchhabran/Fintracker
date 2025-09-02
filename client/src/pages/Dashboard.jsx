import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList'; // Corrected path
import BudgetManager from '../components/BudgetManager';
import SpendingPieChart from '../components/SpendingPieChart'; // Corrected path
import SpendingBarChart from '../components/SpendingBarChart';
import EditTransactionModal from '../components/EditTransactionModal';
import EditBudgetModal from '../components/EditBudgetModal';
import GoalsPage from './GoalsPage';
import RiskAssessmentPage from './RiskAssessmentPage';
import { getApiUrl } from '../api';

const Dashboard = ({ onLogout, token }) => {
    console.log('4. Dashboard component received token prop:', token);
  // --- State Management ---
  const [activeView, setActiveView] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summaryData, setSummaryData] = useState({ spendingByCategory: [], monthlySpending: [] });
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  // --- Data Fetching ---
  const fetchDashboardData = useCallback(async () => {
    if (activeView !== 'dashboard') {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError('');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    try {
      const [transRes, budgRes, summaryRes] = await Promise.all([
        fetch(getApiUrl('transactions'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl(`budgets/${year}/${month}`), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('dashboard/summary'), { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!transRes.ok || !budgRes.ok || !summaryRes.ok) {
        throw new Error('Failed to fetch dashboard data. Please try again.');
      }
      
      const transData = await transRes.json();
      const budgData = await budgRes.json();
      const summaryData = await summaryRes.json();
      
      setTransactions(transData);
      setBudgets(budgData);
      setSummaryData(summaryData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, currentDate, activeView]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Event Handlers ---
  const handleDataUpdate = () => fetchDashboardData();

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
        const res = await fetch(getApiUrl(`transactions/${id}`), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete transaction.');
        }

        handleDataUpdate();

    } catch (err) {
        alert(err.message);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'goals':
        return <GoalsPage token={token} />;
      case 'risk':
        return (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto">
                <RiskAssessmentPage token={token} onComplete={() => setActiveView('dashboard')} />
            </div>
        );
      case 'dashboard':
      default:
        return (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Spending Trend</h3>
                        <SpendingBarChart chartData={summaryData.monthlySpending} />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</h3>
                        <SpendingPieChart chartData={summaryData.spendingByCategory} />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1 space-y-8">
                        <TransactionForm token={token} onAddTransaction={handleDataUpdate} />
                        <BudgetManager token={token} budgets={budgets} onBudgetUpdate={handleDataUpdate} currentDate={currentDate} transactions={transactions} onEditBudget={setEditingBudget} />
                    </div>
                    <div className="lg:col-span-2">
                        <TransactionList 
                            transactions={transactions} 
                            isLoading={isLoading} 
                            error={error} 
                            onEdit={setEditingTransaction} 
                            onDelete={handleDeleteTransaction} // This now correctly passes the delete handler
                        />
                    </div>
                </div>
            </>
        );
    }
  };
  
  // --- Reusable Navigation Button Components ---
  const NavButton = ({ viewName, children }) => {
    const isActive = activeView === viewName;
    return (
        <button 
            onClick={() => setActiveView(viewName)} 
            className={`font-semibold transition ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
        >
            {children}
        </button>
    );
  };

  const MobileNavButton = ({ viewName, children }) => {
      const isActive = activeView === viewName;
      return (
          <button 
            onClick={() => { setActiveView(viewName); setIsMenuOpen(false); }} 
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'}`}
          >
              {children}
          </button>
      );
  };

  return (
     <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveView('dashboard')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800">Mudra-Plan</h1>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6">
                        <NavButton viewName="dashboard">Dashboard</NavButton>
                        <NavButton viewName="goals">Goals</NavButton>
                        <NavButton viewName="risk">Risk Profile</NavButton>
                        <button onClick={onLogout} className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200">Logout</button>
                    </nav>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavButton viewName="dashboard">Dashboard</MobileNavButton>
                        <MobileNavButton viewName="goals">Goals</MobileNavButton>
                        <MobileNavButton viewName="risk">Risk Profile</MobileNavButton>
                        <button onClick={onLogout} className="block w-full text-left px-3 py-2 rounded-md font-medium text-red-600 hover:bg-red-50">Logout</button>
                    </nav>
                </div>
            )}
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderView()}
        </main>
        
        {editingTransaction && <EditTransactionModal token={token} transaction={editingTransaction} onClose={() => setEditingTransaction(null)} onUpdate={handleDataUpdate} />}
        {editingBudget && <EditBudgetModal token={token} budget={editingBudget} onClose={() => setEditingBudget(null)} onUpdate={handleDataUpdate} />}
    </div>
  );
};

export default Dashboard;
