import React from 'react';
import styled from 'styled-components';
import img from '../images/BackGround4.png'
import Cookies from 'js-cookie';

const Con = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
`;

const BackGround = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: black;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BackGroundVideo = styled.img`
    position: absolute;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
`;

const Content = styled.div`
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.h1`
    color: #000;
    font-size: 1.6rem;
    margin-top: -280px;
`;

const SubHeader = styled.h2`
    color: #000;
    font-size: 6rem;
    text-align: center;
    margin-top: 10px;
`;

const EyeGrabber = ({ currentUser }) => {

    //const username = Cookies.get('username');

    return (
        <Con>
            <BackGround>
                <BackGroundVideo src={img} alt = 'all'/>
            </BackGround>
            <Content>
            {currentUser ? (
                <>
                    <Header>Welcome back, Username!</Header>
                    <SubHeader>Ready to take your game to the NEXT LEVEL?</SubHeader>
                </>
            ) : (
                <>
                    <Header>Elevate Your Game With</Header>
                    <SubHeader>PitchPro</SubHeader>
                </>
            )}
            </Content>
        </Con>
    )
}

export default EyeGrabber;
