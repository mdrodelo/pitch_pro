import { Line } from 'react-chartjs-2'; 
import {
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend
);

export const LineGraph = () => {

    const data = {
        labels: Array.from({length: 91}, (_, i) => i), // Minutes from 0 to 90
        datasets: [
            {
                label: 'Player Speed',
                data: Array.from({length: 91}, () => Math.floor(Math.random() * 40)), // Random speed data
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Heart Rate',
                data: Array.from({length: 91}, () => Math.floor(Math.random() * 180) + 60), // Random heart rate data
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (minutes)',
                    font: {
                        size: 20, // Adjust as needed
                        weight: 'bold', // Make the text bold
                    },
                    color: '#FFFFFF' // Make the text white
                },
                ticks: {
                    color: '#FFFFFF', // Make the ticks white
                    font: {
                        size: 16, // Adjust as needed
                        weight: 'bold', // Make the text bold
                    },
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Speed (km/h)',
                    font: {
                        size: 20, // Adjust as needed
                        weight: 'bold', // Make the text bold
                    },
                    color: '#FFFFFF' // Make the text white
                },
                ticks: {
                    color: '#FFFFFF', // Make the ticks white
                    font: {
                        size: 16, // Adjust as needed
                        weight: 'bold', // Make the text bold
                    },
                }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Player Speed throughout Match',
                font: {
                    size: 24, // Adjust as needed
                    weight: 'bold', // Make the text bold
                },
                color: '#FFFFFF' // Make the title text white
            },
            legend: {
                labels: {
                    color: '#FFFFFF', // Make the legend text white
                    font: {
                        size: 16, // Adjust as needed
                        weight: 'bold', // Make the text bold
                    },
                }
            }
        }
    };


    return (
        
        <Line options={options} data={data} />
    )
}   