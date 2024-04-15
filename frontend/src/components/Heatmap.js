import React from 'react';
import {useState, useEffect} from 'react';
import img from "../images/image3.svg";
import styled from "styled-components";
import client from "./api";

const Img = styled.img`
    padding-right: 0;
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    max-height: 500px;
`;

export default function Heatmap(props) {
    const [image, setImage] = useState(img);

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
        alert("Clicked Image!");
    }

    if (props.id < 0)
        return (<></>);

    return (
        <>
            {props.id > 0 && <Img src={image} alt='all' onClick={handleImageClick} />}
        </>
    );
}