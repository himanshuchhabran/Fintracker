import React, { useState } from 'react';
import { getApiUrl } from '../api'; // 1. Import the helper

const questions = [
    {
        question: "What is your primary goal for this investment?",
        options: [
            { text: "Capital preservation; I want to avoid losses.", value: 1 },
            { text: "A mix of income and moderate growth.", value: 3 },
            { text: "Significant long-term growth, accepting higher risk.", value: 5 }
        ]
    },
    {
        question: "How would you react to a 20% drop in your portfolio's value in a single year?",
        options: [
            { text: "Sell all my investments to prevent further loss.", value: 1 },
            { text: "Wait and see, but feel very anxious.", value: 3 },
            { text: "See it as a buying opportunity and invest more.", value: 5 }
        ]
    },
    {
        question: "How long is your investment horizon?",
        options: [
            { text: "Less than 3 years.", value: 1 },
            { text: "3 to 10 years.", value: 3 },
            { text: "More than 10 years.", value: 5 }
        ]
    },
    {
        question: "How much of your income are you comfortable investing?",
        options: [
            { text: "Less than 10%", value: 1 },
            { text: "10% to 25%", value: 3 },
            { text: "More than 25%", value: 5 }
        ]
    }
];

const RiskAssessmentPage = ({ token, onComplete }) => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers({ ...answers, [questionIndex]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(answers).length !== questions.length) {
            setError('Please answer all questions.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            // 2. Use the helper function here, removing /api
            const res = await fetch(getApiUrl('risk/submit'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers: Object.values(answers) })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to submit answers.');
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (result) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-600 mb-2">Your Investor Profile is Ready!</h2>
                <p className="text-5xl font-bold text-gray-800 mb-4">{result.risk_profile}</p>
                <p className="text-gray-600 mb-6">{result.recommendations.description}</p>
                
                <div className="text-left my-8 space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Suggested Portfolio Allocation:</h3>
                    {result.recommendations.portfolio.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">{item.instrument}</span>
                                <span className="font-bold text-emerald-600">{item.allocation}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                        </div>
                    ))}
                </div>

                <button onClick={onComplete} className="bg-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((q, index) => (
                <div key={index}>
                    <p className="font-semibold text-lg text-gray-800 mb-3">{index + 1}. {q.question}</p>
                    <div className="space-y-2">
                        {q.options.map(opt => (
                            <label key={opt.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-400">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={opt.value}
                                    checked={answers[index] === opt.value}
                                    onChange={() => handleAnswerChange(index, opt.value)}
                                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                />
                                <span className="ml-3 text-gray-700">{opt.text}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 transition">
                {isLoading ? 'Calculating...' : 'Get My Profile'}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
    );
};

export default RiskAssessmentPage;
