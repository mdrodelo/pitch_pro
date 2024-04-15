import React from 'react';
import {useState, useEffect} from 'react';
import styled from "styled-components";
import client from "./api";
import { useNavigate } from 'react-router-dom';

const Img = styled.img`
    padding-right: 0;
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    max-height: 500px;
`;

export default function Heatmap(props) {
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (props.id < 1) return;
        client.post("api/heatmap", {
            game_id: props.id
        }).then(function(res) {
            setImage(res.data['heatmap']);
        });
    }, [props.id]);

    function handleImageClick() {
        // TODO navigate to GameDetails page
        navigate('/gamedetails', { state: { gameId: props.id } });
    }

    if (props.id < 0)
        return (<></>);

    return (
        <>
            {props.id > 0 && <Img src={image} alt='all' onClick={handleImageClick} />}
        </>
    );
}