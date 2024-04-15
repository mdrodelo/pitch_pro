import React, { useState } from 'react';
import styled from 'styled-components';
import img from '../images/image3.svg';
import { LineGraph } from './Line'

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
    width: 100%;
    height: 100%;
`;

const Image = styled.img`
    max-width: 100%;
    height: 100%;
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

export default function GameDetails() {
    const [selected, setSelected] = useState(null);

    return (
        <DetailsContainer>
            <Title>Sunday League MatchDay #1</Title>
            <Date>4/14/2024</Date>
            <Position>Striker</Position>
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
                {selected === 'HeartRate' && <LineGraph id="LineGraph1" />}
                {selected === 'HeatMap' && <Image src={img} alt={'all'} />}
                {selected === 'VitalStats' && <LineGraph id="LineGraph2" />}
            </MidSection>
        </DetailsContainer>
       
    );
}