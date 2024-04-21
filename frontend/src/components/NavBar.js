import React from 'react';
import styled from 'styled-components';
import { Link as LinkRouter } from 'react-router-dom';
import { Link as LinkScroll } from 'react-scroll';
import axios from "axios";
import Cookies from 'js-cookie';
import {useEffect, useState, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import img from '../images/BackGround4.png'
import img2 from '../images/SoccerField.png';
import client from "./api";
import { EmailContext } from '../App';

const Nav = styled.nav`
    background: transparent;
    display: flex;
    justify-content: center;
    font-size: 1.0rem;
    font-weight: 800;
    top: 0;
    z-index: 1;
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
    width: 100%;
`;

const Content = styled.div`
    position: absolute;
    z-index: 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.h1`
    color: #fff;
    font-size: 1.6rem;
    font-weight: 800;
    margin-top: 280px;
`;

const HeaderLogin = styled.h1`
    color: #fff;
    font-size: 6rem;
    font-weight: 800;
    margin-top: 280px;
`;

const SubHeader = styled.h2`
    color: #fff;
    font-size: 6rem;
    font-weight: 800;
    text-align: center;
    margin-top: 10px;
`;

const SubHeaderLogin = styled.h2`
    color: #fff;
    font-size: 1.6rem;
    font-weight: 800;
    text-align: center;
    margin-top: 10px;
`;

const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    z-index: 100;
    width: 100%;
    padding: 0 24px;
    max-width: 1100px;
`;

const NavLogo = styled(LinkRouter)`
    color: #fff;
    justify-self: flex-start;
    cursor: pointer;
    font-size: 3rem;
    display: flex;
    align-items: center;
    margin-left: 24px;
    font-weight: 800;
    /* font-style: italic; */
    text-decoration: none;
`;

const NavMenu = styled.ul`
    display: flex;
    align-items: center;
    list-style: none;
    text-align: center;
    margin-right: -22px;
`;

const NavItem = styled.li`
    height: 80px;
`;

const NavLinks = styled(LinkScroll)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        border-bottom: 3px solid #1e7ebb;
    }
`;

const NavButton = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 24px;
    margin-left: 24px;

`;

const NavButtonLink = styled(LinkRouter)`
    border-radius: 50px;
    background: #000;
    z-index: 10;
    white-space: nowrap;
    padding: 10px 22px;
    color: #fff;
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

const NavBar = ({ currentUser, setCurrentUser }) => {
    const { email, setEmail } = useContext(EmailContext);
    const navigate = useNavigate();
    function submitLogout(e) {
        e.preventDefault();
        client.post(
            "/api/logout",
            {withCredentials: true}
        ).then(function(res) {
            console.log('Server response:', res);
            setCurrentUser(false);
            navigate('/', { replace: true });
        });
    }

    return (
        <>
            <Nav>
                <BackGround>
                    <BackGroundVideo src={img2} alt = 'all'/>
                </BackGround>
               <NavbarContainer>
                    <NavLogo to= '/'>PitchPro</NavLogo>
                    <NavMenu>
                        {currentUser ? (
                            <>
                                <NavItem>
                                    <NavLinks to='add-data-section'>Add Data</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='my-data-section'>My Data</NavLinks>
                                </NavItem>
                                <NavButton>
                                    <NavButtonLink to='/' onClick={(e) => submitLogout(e)}>Logout</NavButtonLink>
                                </NavButton>
                            </>
                        ) : (
                            <>
                                <NavItem>
                                    <NavLinks to='/'>Home</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='about-section' smooth={true} duration={500} spy={true} exact='true'>About</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='instructions-section' smooth={true} duration={500} spy={true} exact='true'>Instructions</NavLinks>
                                </NavItem>
                                <NavButton>
                                    <NavButtonLink to='login'>Login</NavButtonLink>
                                </NavButton>
                            </>
                        )}
                    </NavMenu>
               </NavbarContainer>
               <Content>
                {currentUser ? (
                    <>
                        <HeaderLogin>Welcome back!</HeaderLogin>
                        <SubHeaderLogin>Ready to take your game to the NEXT LEVEL?</SubHeaderLogin>
                    </>
                ) : (
                    <>
                        <Header>Elevate Your Game With</Header>
                        <SubHeader>PitchPro</SubHeader>
                    </>
                )}
                </Content>
            </Nav>
        </>
    );
}

export default NavBar;
