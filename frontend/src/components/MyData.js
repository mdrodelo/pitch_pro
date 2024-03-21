import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import { EditControl } from "react-leaflet-draw"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './MyData.css';
import axios from "axios";
import styled from 'styled-components';
import img from '../images/image3.svg';

/*
<MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={false}>
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    <Marker position={[51.505, -0.09]}>
        <Popup>
            CSS3 popup.
        </Popup>
    </Marker>
</MapContainer>

 */
const HomeContainer = styled.div`
    color: #fff;
    background-color: #030c12;
`;

const SectionContainer = styled.div`
    width: 100%;
    display: grid;
    height: 860px;
    padding: 0 24px;
    justify-content: center;
    z-index: 1;
    max-width: 1100px;
    margin-right: auto;
    margin-left: auto;
`;

const GameLogSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-columns: minmax(auto, 1fr);
    align-items: center;
    grid-template-areas: 'col1 col2';
`;

const NewGameSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-columns: minmax(auto, 1fr);
    align-items: center;
    grid-template-areas: 'col1 col2';
`;

const Column1 = styled.div`
    margin-bottom: 15px;
    padding: 0 15px;
    grid-area: col1;
`;

const TextContent = styled.div`
    max-width: 540px;
    padding-top: 0;
    padding-bottom: 60px;
`;

const Column2 = styled.div`
    margin-bottom: 15px;
    padding: 0 15px;
    grid-area: col2;
`;

const ImgContainer = styled.div`
    max-width: 555px;
    display: flex;
    justify-content: flex-start;
`;

const Img = styled.img`
    padding-right: 0;
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    max-height: 500px;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #f7f8fa;
`;

const StyledTh = styled.th`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
`;

const StyledTd = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
`;

const AddDataDiv = styled.div`
    margin-bottom: 35px;
    font-size: 18px;
    line-height: 24px;
    color: #f7f8fa;
`;

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    border-radius: 50px;
    background: #76e4e0;
    white-space: nowrap;
    padding: 10px 22px;
    color: #000;
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

const data = [
    {title: "game 1", "date": "12/12/2023"},
    {title: "game 2", "date": "12/20/2023"},
    {title: "game 3", "date": "1/12/2024"},
]

function MyData() {
    const [file, setFile] = useState(null);
    const [showImage, setShowImage] = useState(false);

    function handleFileChange(e) {
        //const mapRef = useRef(null);
        let fileReader = new FileReader();

        fileReader.onload = function(e)  {
            setFile(e.target.result);
            const map = L.map('map').setView([0,0], 2);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            new L.GPX(e.target.result, {
                async: true,
                //ref: {mapRef},
                drawControl: true,
                marker_options: {
                    startIconUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-icon-start.png',
                    endIconUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-icon-end.png',
                    shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-shadow.png'
                }
            }).on('loaded', function(e) {
                map.fitBounds(e.target.getBounds());
            }).addTo(map);
            console.log(file);
            // draw layers
            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            var drawControl = new L.Control.Draw({
                draw: {
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, function(e) {
                let layer = e.layer;

                drawnItems.addLayer(layer);
            })
        }
        fileReader.readAsText(e.target.files[0], "UTF-8");
    }


    return (
        <div>
            <HomeContainer>
                <SectionContainer>
                    <GameLogSection>
                        <Column1>
                        <TextContent>
                            <StyledTable>
                                <tr>
                                    <StyledTh>Title</StyledTh>
                                    <StyledTh>Date</StyledTh>
                                    <StyledTh></StyledTh>
                                </tr>
                                {data.map((val, key) => {
                                    return (
                                        <tr key={key}>
                                            <StyledTd>{val.title}</StyledTd>
                                            <StyledTd>{val.date}</StyledTd>
                                            <StyledTd><StyledButton onClick={() => setShowImage(prevShowImage => !prevShowImage)}>View</StyledButton></StyledTd>
                                        </tr>
                                    )
                                })}
                            </StyledTable>
                        </TextContent>
                        </Column1>
                        <Column2>
                            <ImgContainer>
                                {showImage && <Img src={img} alt='all' />}
                            </ImgContainer>
                        </Column2>
                    </GameLogSection>
                </SectionContainer>
            </HomeContainer>
            <HomeContainer>
                <SectionContainer>
                    <NewGameSection>
                        <Column1>
                        <TextContent>
                            <AddDataDiv>Add data</AddDataDiv>
                            <input type="file" accept='.gpx' onChange={handleFileChange}/>
                        </TextContent>
                        </Column1>
                        <Column2>
                            <ImgContainer>
                                <div id="map"></div>
                            </ImgContainer>
                        </Column2>
                    </NewGameSection>
                </SectionContainer>
            </HomeContainer> 
        </div>                        
    );
}

export default MyData;