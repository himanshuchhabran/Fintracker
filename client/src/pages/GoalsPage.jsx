import React, { useState, useEffect, useCallback } from 'react';
import AddGoalModal from '../components/AddGoalModal';
import ContributeModal from '../components/ContributeModal';

const GoalCard = ({ goal, onContributeClick, onDeleteClick }) => {
    const progress = goal.target_amount > 0 ? (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100 : 0;
    const remaining = parseFloat(goal.target_amount) - parseFloat(goal.current_amount);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800">{goal.goal_name}</h3>
            {goal.target_date && <p className="text-sm text-gray-500 mb-4">Target: {new Date(goal.target_date).toLocaleDateString('en-IN')}</p>}
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex justify-between text-sm font-medium text-gray-600 mb-4">
                <span>₹{parseFloat(goal.current_amount).toLocaleString('en-IN')}</span>
                <span>₹{parseFloat(goal.target_amount).toLocaleString('en-IN')}</span>
            </div>
            
            <p className="text-center text-emerald-700 font-semibold mb-4">
                {remaining > 0 ? `₹${remaining.toLocaleString('en-IN')} more to go!` : "Goal Achieved! 🎉"}
            </p>

            <div className="mt-auto flex space-x-2">
                <button onClick={onContributeClick} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition">Contribute</button>
                <button onClick={onDeleteClick} className="p-2 rounded-lg hover:bg-gray-100" title="Delete Goal">
                    <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const GoalsPage = ({ token }) => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const fetchGoals = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/goals', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to fetch goals');
            const data = await res.json();
            setGoals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleContributeClick = (goal) => {
        setSelectedGoal(goal);
        setIsContributeModalOpen(true);
    };
    
    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) return;
        try {
            await fetch(`/api/goals/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchGoals();
        } catch (error) {
            alert('Failed to delete goal.');
        }
    };

    if (isLoading) return <p className="text-center text-gray-500">Loading goals...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Your Financial Goals</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition">
                    + Add New Goal
                </button>
            </div>

            {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard 
                            key={goal.id} 
                            goal={goal} 
                            onContributeClick={() => handleContributeClick(goal)}
                            onDeleteClick={() => handleDeleteClick(goal.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-lg border">
                    <h3 className="text-lg font-medium text-gray-900">No goals yet!</h3>
                    <p className="mt-1 text-sm text-gray-500">Click "Add New Goal" to start planning.</p>
                </div>
            )}
            
            {isAddModalOpen && <AddGoalModal token={token} onClose={() => setIsAddModalOpen(false)} onUpdate={fetchGoals} />}
            {isContributeModalOpen && <ContributeModal token={token} goal={selectedGoal} onClose={() => setIsContributeModalOpen(false)} onUpdate={fetchGoals} />}
        </div>
    );
};

export default GoalsPage;