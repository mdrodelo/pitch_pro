import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { LineGraph } from './Line'
import client from "./api";

const DetailsContainer = styled.div`
    background: #1b2838; // A subtly lighter shade of grey-blue
    color: #fff;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 4rem;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
`;

const Date = styled.h2`
    font-size: 2rem;
    font-weight: lighter;
    text-align: center;
    margin-top: 10px;
`;

const Position = styled.h2`
    font-size: 2rem;
    font-weight: lighter;
    text-align: center;
    margin-top: 10px;
`;

const MidSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center; // Center children horizontally
    align-items: center; // Center children vertically
    width: 1000px;
    height: 800px;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    max-width: 500px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const ButtonToggle = styled.button`
    border-radius: 30px;
    background-color: ${props => props.selected ? '#abdae4' : '#333'};
    padding: 10px 20px;
    color: ${props => props.selected ? '#333' : '#fff'};
    font-size: 16px;
    margin: 5px;
    cursor: pointer;
    outline: none;
    border: none;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #abdae4;
        color: #333;
        transform: scale(1.05);
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
`;

const StyledLineGraph = styled(LineGraph)`
    width: 70%;
    height: 70%;
`;

const GameInfoTable = styled.table`
    max-width: 400px;
`;

const HeatMapButtons = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px; // Add some space between the image and the buttons
`;

export default function GameDetails() {
    const [data, setData] = useState([]);
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    let location = useLocation();
    let gameId = location.state && location.state.gameId;

    

    useEffect(() => {
        client.post("/api/SingleGameData",
        {
            game_id: gameId
        })
        .then(function (res) {
            console.log(res.data);
            setData(res.data);
        });

        client.post("/api/heatmap", 
        {
            game_id: gameId
        }).then(function(res) {
            setImage(res.data['heatmap']);
        });

        client.post("/api/HeatmapsByHalves", 
        {
            game_id: gameId
        }).then(function(res) {
            console.log(res.data);
            const heatmaps = res.data['heatmaps'];
            setImages(heatmaps);
            setSelected(prevState => ({ ...prevState, heatmap: heatmaps[0] })); // Set the first heatmap as the selected one by default
        });

    }, []);

    const [selected, setSelected] = useState({ section: 'HeartRate', heatmap: image });

    const averageHeartRate = data.heart_rate ? data.heart_rate.reduce((a, b) => a + b, 0) / data.heart_rate.length : 0;
    const maxHeartRate = data.heart_rate ? Math.max(...data.heart_rate) : 0;

    return (
        <DetailsContainer>
            <Title>{data ? data.title : 'Loading...'}</Title>
            <Date>{data ? data.date : 'Loading...'}</Date>
            <Position>{data ? data.position : 'Loading...'}</Position>
            <ButtonContainer>
                <ButtonToggle
                    selected={selected.section === 'HeartRate'}
                    onClick={() => setSelected({ section: 'HeartRate', heatmap: null })}
                >
                    Match Stats
                </ButtonToggle>
                <ButtonToggle 
                    selected={selected.section === 'HeatMap'}
                    onClick={() => setSelected({ section: 'HeatMap', heatmap: image })}
                >
                    Heat Map
                </ButtonToggle>
            </ButtonContainer>
            <MidSection>
                {selected.section === 'HeartRate' && (
                    <>
                        <StyledLineGraph id="LineGraph1" heartRateData={data.heart_rate} />
                        <GameInfoTable>
                        <tr>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px'}}>Average Heart Rate</td>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px'}}>{Math.round(averageHeartRate)} bpm</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px' }}>Max Heart Rate</td>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px' }}>{Math.round(maxHeartRate)} bpm</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px' }}>Average Speed During Match</td>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px' }}>{parseFloat(data.avg_speed).toFixed(2)} mph</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px' }}>Total Distance Traveled</td>
                            <td style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px 20px' }}>{Math.round(data.total_distance)} meters</td>
                        </tr>
                        </GameInfoTable>
                    </>
                )}
                {selected.section === 'HeatMap' && (
                    <>
                        {selected.heatmap && <Image src={selected.heatmap} alt="Heatmap" />}
                        <HeatMapButtons>
                            <ButtonToggle
                                selected={selected.heatmap === image}
                                onClick={() => setSelected(prevState => ({ ...prevState, heatmap: image }))}
                            >
                                Full Game
                            </ButtonToggle>
                            {images.length > 1 && images.map((img, index) => (
                                <ButtonToggle
                                    key={index}
                                    selected={selected.heatmap === img}
                                    onClick={() => setSelected(prevState => ({ ...prevState, heatmap: img }))}
                                >
                                    Heatmap {index + 1}
                                </ButtonToggle>
                        ))}
                        </HeatMapButtons>
                    </>
                )}
            </MidSection>
        </DetailsContainer>
    );
}