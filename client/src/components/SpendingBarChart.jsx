
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpendingBarChart = ({ chartData }) => {
    // Helper to format month labels (e.g., "2025-08" -> "Aug")
    const formatMonth = (monthStr) => {
        const date = new Date(`${monthStr}-02`); // Use day 2 to avoid timezone issues
        return date.toLocaleString('default', { month: 'short' });
    };

    const data = {
        labels: chartData.map(d => formatMonth(d.month)),
        datasets: [
            {
                label: 'Total Spending (₹)',
                data: chartData.map(d => d.total),
                backgroundColor: '#10B981',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₹' + value;
                    }
                }
            },
        },
    };
    
    if (!chartData || chartData.length === 0) {
        return <p className="text-center text-gray-500 py-10">Not enough data to display a trend.</p>;
    }

    return (
        <div style={{ height: '300px' }}>
            <Bar options={options} data={data} />
        </div>
    );
};

export default SpendingBarChart;