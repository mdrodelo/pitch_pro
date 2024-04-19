import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { LineGraph } from './Line'
import client from "./api";
import { EmailContext } from '../App';

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
    flex-direction: column;
    align-items: center; // Center children horizontally
    width: 100%;
    height: 100%;
`;

const Image = styled.img`
    margin-top: 10px;
    width: 80%;
    height: 80%;
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
    max-width: 80%;
    max-height: 80%;
`;

export default function GameDetails() {
    const [selected, setSelected] = useState('HeatMap');
    const { email } = useContext(EmailContext);
    const [data, setData] = useState([]);
    const [image, setImage] = useState('');
    let location = useLocation();
    let gameId = location.state && location.state.gameId;
    const [game, setGame] = useState(null);

    client.post("api/heatmap", {
        game_id: gameId
    }).then(function(res) {
        setImage(res.data['heatmap']);
    });

    useEffect(() => {
        client.post("/api/gamedata",
            {
                email: email
            })
            .then(function (res) {
                console.log(res.data);
                setData(res.data);
                //Find the game with the given gameId
                const game = res.data.find(game => game.game_id === gameId);
                setGame(game);
            });
    }, []);

    const VitalStatsTable = () => (
        <table style={{ marginTop: '10px' }}>
            <tr>
                <th>Total Distance Traveled</th>
                <td>{game ? 'game.total_distance' : 'Loading...'}</td>
            </tr>
            <tr>
                <th>Average Heart Rate</th>
                <td>{game ? 'game.avg_heart_rate' : 'Loading...'}</td>
            </tr>
            <tr>
                <th>Max Heart Rate</th>
                <td>{game ? 'game.max_heart_rate' : 'Loading...'}</td>
            </tr>
            <tr>
                <th>Calories Burned</th>
                <td>{game ? 'game.calories_burned' : 'Loading...'}</td>
            </tr>
            <tr>
                <th>Top Speed</th>
                <td>{game ? 'game.top_speed' : 'Loading...'}</td>
            </tr>
        </table>
    );


    return (
        <DetailsContainer>
            <Title>{game ? game.game_title : 'Loading...'}</Title>
            <Date>{game ? game.game_date : 'Loading...'}</Date>
            <Position>{game ? game.position : 'Loading...'}</Position>
            <ButtonContainer>
                <ButtonToggle
                    slected={selected === 'HeartRate'}
                    onClick={() => setSelected('HeartRate')}
                >
                    Heart Rate
                </ButtonToggle>
                <ButtonToggle 
                    selected={selected === 'HeatMap'}
                    onClick={() => setSelected('HeatMap')}
                >
                    Heat Map
                </ButtonToggle>
                <ButtonToggle 
                    selected={selected === 'VitalStats'}
                    onClick={() => setSelected('VitalStats')}
                >
                    Vital Stats
                </ButtonToggle>
            </ButtonContainer>
            <MidSection>
                {selected === 'HeartRate' && <StyledLineGraph id="LineGraph1" />}
                {selected === 'HeatMap' && <Image src={image} alt='all' />}
                {selected === 'VitalStats' && <VitalStatsTable />}
            </MidSection>
        </DetailsContainer>
    );
}