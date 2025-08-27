import React from 'react';

// A small helper function for better date formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const TransactionList = ({ transactions, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500 py-12">Loading transactions...</p>;
    }
    if (error) {
      return <p className="text-center text-red-600 py-12">{error}</p>;
    }
    if (transactions.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">Add a new expense to get started.</p>
        </div>
      );
    }

    return (
      <ul className="divide-y divide-gray-200">
        {transactions.map(t => (
          <li key={t.id} className="flex justify-between items-center py-4">
            <div className="flex-grow">
              <p className="font-semibold text-gray-800">{t.description || t.category}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatDate(t.transaction_date)}</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{t.category}</span>
              </div>
            </div>
            <p className="font-bold text-lg text-red-600 ml-4">-₹{parseFloat(t.amount).toFixed(2)}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Recent Transactions</h3>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default TransactionList;
