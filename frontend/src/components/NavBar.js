import React from 'react';
import styled from 'styled-components';
import { Link as LinkRouter } from 'react-router-dom';
import { Link as LinkScroll } from 'react-scroll';
import axios from "axios";
import Cookies from 'js-cookie';
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import img from '../images/BackGround4.png';

const Nav = styled.nav`
    background: transparent;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    position: sticky;
    top: 0;
    z-index: 10;
`;

const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    z-index: 1;
    width: 100%;
    padding: 0 24px;
    max-width: 1100px;
`;

const NavLogo = styled(LinkRouter)`
    color: #000;
    justify-self: flex-start;
    cursor: pointer;
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    margin-left: 24px;
    font-weight: 700;
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
    color: #000;
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



const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});


const NavBar = ({ currentUser, setCurrentUser }) => {
    const navigate = useNavigate();

    function submitLogout(e) {
        e.preventDefault();
        client.post(
            "/api/logout",
            {withCredentials: true}
        ).then(function(res) {
        console.log('Server response:', res);
        setCurrentUser(false);
        // Cookies.remove('username');
        navigate('/', { replace: true });
        });
    }

    return (
        <>
            <Nav>
               <NavbarContainer>
                    <NavLogo to= '/'>PitchPro</NavLogo>
                    <NavMenu>
                        {currentUser ? (
                            <>
                                <NavItem>
                                    <NavLinks to='mydata'>MyData</NavLinks>
                                </NavItem>
                                <NavButton>
                                    <NavButtonLink to='/' onClick={(e) => submitLogout(e)}>Logout</NavButtonLink>
                                </NavButton>
                            </>
                        ) : (
                            <>
                                <NavItem>
                                    <NavLinks to='home'>Home</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='About'>About</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='Instructions'>Instructions</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks to='login'>Get Started</NavLinks>
                                </NavItem>
                                <NavButton>
                                    <NavButtonLink to='login'>Login</NavButtonLink>
                                </NavButton>
                            </>
                        )}
                    </NavMenu>
               </NavbarContainer>
            </Nav>
        </>
    );
}

export default NavBar;
