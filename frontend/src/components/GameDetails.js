import React from 'react';
import styled from 'styled-components';
import img from '../images/image3.svg';

const DetailsContainer = styled.div`
    color: #fff;
    background-color: #030c12;
`;

const Title = styled.h1`
    color: #000;
    font-size: 6rem;
    font-weight: 800;
    text-align: center;
    margin-top: 10px;
`;

const Date = styled.p`
    color: #000;
    font-size: 1.6rem;
    font-weight: 800;
    margin-top: 280px;
`;

const ImageContainer = styled.div`
    max-width: 555px;
    display: flex;
    justify-content: flex-start;
`;

const Image = styled.img`
    padding-right: 0;
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    max-height: 500px;
`;

export default function GameDetails() {
    return (
        <DetailsContainer>
            <Title>Title PlaceHolder</Title>
            <Date>Date</Date>
            <ImageContainer>
                <Image src={img} alt={'all'} />
            </ImageContainer>
        </DetailsContainer>
    );
}