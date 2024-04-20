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

export const LineGraph = ({ heartRateData }) => {

    const data = {
        labels: heartRateData ? Array.from({length: heartRateData.length}, (_, i) => i) : [], // Minutes from 0 to 90
        datasets: [
            {
                label: 'Heart Rate',
                data: heartRateData || [], 
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };
    
    const options = {
        responsive: true,
        width: '60%',
        height: '60%',
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
                    text: 'Heart-Rate (bpm)',
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
                text: 'Player HeartRate throughout Match',
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