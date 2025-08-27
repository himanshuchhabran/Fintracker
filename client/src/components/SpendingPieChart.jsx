
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingPieChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => d.category),
        datasets: [
            {
                label: 'Expenses',
                data: chartData.map(d => d.total),
                backgroundColor: [
                    '#10B981', // Emerald 500
                    '#3B82F6', // Blue 500
                    '#F59E0B', // Amber 500
                    '#EF4444', // Red 500
                    '#8B5CF6', // Violet 500
                    '#6366F1', // Indigo 500
                    '#EC4899', // Pink 500
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: false,
            },
        },
    };

    if (!chartData || chartData.length === 0) {
        return <p className="text-center text-gray-500 py-10">No spending data for this month.</p>;
    }

    return <Pie data={data} options={options} />;
};

export default SpendingPieChart;