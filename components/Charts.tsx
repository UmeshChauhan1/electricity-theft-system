import React from 'react';
import { Bar } from 'react-chartjs-2';

const Charts = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Theft Cases',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                data: [65, 59, 80, 81, 56, 55, 40],
            },
            {
                label: 'Recovered Cases',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                data: [28, 48, 40, 19, 86, 27, 90],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-full p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Theft Cases and Recovery Trends</h2>
            <div className="h-72">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default Charts;
