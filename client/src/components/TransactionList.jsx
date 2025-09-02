import React, { useState } from 'react';
import { getApiUrl } from '../api';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const TransactionList = ({ transactions, isLoading, error, onEdit, onDelete, token }) => {
  const [deletingId, setDeletingId] = useState(null);

//   const handleDelete = async (id) => {
//   if (!window.confirm('Are you sure you want to delete this transaction?')) return;

//   if (!token) {
//     alert('Authentication error. Please log in again.');
//     return;
//   }

//   try {
//     setDeletingId(id);
//     const res = await fetch(getApiUrl(`transactions/${id}`), {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || 'Failed to delete transaction');
//     }

//     onDelete();
//   } catch (err) {
//     alert(err.message);
//   } finally {
//     setDeletingId(null);
//   }
// };

  const renderContent = () => {
    if (isLoading) return <p className="text-center text-gray-500 py-12">Loading transactions...</p>;
    if (error) return <p className="text-center text-red-600 py-12">{error}</p>;
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
          <li key={t.id} className="flex justify-between items-center py-4 group">
            <div className="flex-grow">
              <p className="font-semibold text-gray-800">{t.description || t.category}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatDate(t.transaction_date)}</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{t.category}</span>
              </div>
            </div>
            <div className="flex items-center">
              {deletingId === t.id ? (
                <span className="text-gray-400 text-sm mr-4">Deleting...</span>
              ) : (
                <p className="font-bold text-lg text-red-600 mr-4">-₹{parseFloat(t.amount).toFixed(2)}</p>
              )}
              <div className="flex space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(t)} title="Edit" className="p-1 rounded-full hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(t.id)} title="Delete" className="p-1 rounded-full hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
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
