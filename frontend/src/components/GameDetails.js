import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { LineGraph } from './Line'
import client from "./api";

const DetailsContainer = styled.div`
    color: #fff;
    background-color: #030c12;
    width: 100vw;
    height: 100vh;
    position: absolute;
    color: #fff;
    display: flex; // Use flexbox
    flex-direction: column; // Stack children vertically
    align-items: center; // Center children horizontally
    overflow: auto; // Add this line to prevent overflow
`;

const Title = styled.h1`
    color: #fff;
    font-size: 6rem;
    font-weight: 800;
    text-align: center;
    margin-top: 10px;
`;

const Date = styled.h2`
    color: #fff;
    font-size: 3rem;
    font-weight: 800;
    margin-top: 10px;
`;

const Position = styled.h2`
    color: #fff;
    font-size: 3rem;
    font-weight: 800;
    text-align: center;
    margin-top: 10px;
`;

const MidSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; // Center children horizontally
    width: 1000px;
    height: 800px;
`;

const Image = styled.img`
    margin-top: 10px;
    max-width: 80%;
    max-height: 80%;
`;

const ButtonToggle = styled.button`
    border-radius: 50px;
    background-color: ${props => props.selected ? '#abdae4' : 'black'};
    z-index: 10;
    white-space: nowrap;
    padding: 10px 22px;
    color: ${props => props.selected ? 'black' : 'white'};
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #abdae4;
        color: #000;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const StyledLineGraph = styled(LineGraph)`
    width: 70%;
    height: 70%;
`;

const GameInfoTable = styled.table`
    max-width: 300px;
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
                    Heart Rate
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
                                <td>Average Heart Rate</td>
                                <td>{averageHeartRate}</td>
                            </tr>
                            <tr>
                                <td>Max Heart Rate</td>
                                <td>{maxHeartRate}</td>
                            </tr>
                            <tr>
                                <td>Average Speed During Match</td>
                                <td>{data.avg_speed}</td>
                            </tr>
                            <tr>
                                <td>Total Distance Traveled</td>
                                <td>{data.total_distance}</td>
                            </tr>
                        </GameInfoTable>
                    </>
                )}
                {selected.section === 'HeatMap' && (
                    <div>
                        <ButtonToggle
                            selected={selected.heatmap === image}
                            onClick={() => setSelected(prevState => ({ ...prevState, heatmap: image }))}
                        >
                            Full Game
                        </ButtonToggle>
                        {images.map((img, index) => (
                            <ButtonToggle
                                key={index}
                                selected={selected.heatmap === img}
                                onClick={() => setSelected(prevState => ({ ...prevState, heatmap: img }))}
                            >
                                Heatmap {index + 1}
                            </ButtonToggle>
                        ))}
                        {selected.heatmap && <Image src={selected.heatmap} alt="Heatmap" />}
                    </div>
                )}
            </MidSection>
        </DetailsContainer>
    );
}