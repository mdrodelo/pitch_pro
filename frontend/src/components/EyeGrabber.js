import React from 'react';
import styled from 'styled-components';
import giFBackground from '../video/BackGround.gif'
import Video from '../video/BackGround4.mp4'
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

const BackGroundVideo = styled.video`
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
    color: #76e4e0;
    font-size: 3rem;
`;

const SubHeader = styled.h2`
    color: #76e4e0;
    font-size: 2rem;
    text-align: center;
`;

const EyeGrabber = ({ currentUser }) => {

    //const username = Cookies.get('username');

    return (
        <Con>
            <BackGround>
                <BackGroundVideo autoPlay loop muted src={Video} type='video/mp4' />
            </BackGround>
            <Content>
            {currentUser ? (
                <>
                    <Header>Welcome back, Username!</Header>
                    <SubHeader>Ready to take your game to the NEXT LEVEL?</SubHeader>
                </>
            ) : (
                <>
                    <Header>Welcome to PitchPro</Header>
                    <SubHeader>Sign up so that you can start your journey in elevating your game to the NEXT LEVEL.</SubHeader>
                </>
            )}
            </Content>
        </Con>
    )
}

export default EyeGrabber;
