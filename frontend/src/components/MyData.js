import React from 'react';
import { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import ReactSlider from 'react-slider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import 'leaflet-draw';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './MyData.css';
import styled from 'styled-components';
import img from '../images/image3.svg';
import client from "./api";
import { EmailContext } from '../App';
import { useNavigate } from 'react-router-dom';

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
    color: white;
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
let drawLayers = false;

let data = []

export default function MyData() {
    const navigate = useNavigate();
    const { email } = useContext(EmailContext);
    const [file, setFile] = useState(undefined);
    const [data, setData] = useState([]);
    const [showImage, setShowImage] = useState(false);

    const handleImageClick = () => {
        navigate('/gamedetails');
    };

    function handleFileChange(e) {
        let fileReader = new FileReader();
        setFile(e.target.result);
        fileReader.onload = function(e)  {
            setFile(e.target.result);
        }
        fileReader.readAsText(e.target.files[0], "UTF-8");
    }

    useEffect(() =>  {
        client.post("/api/gamedata",
        {
            email: email
        })
        .then(function(res) {
            setData(res.data);
            //data = res.data;
        });
    }, []);

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
                                            <StyledTd>{val.game_title}</StyledTd>
                                            <StyledTd>{val.game_date}</StyledTd>
                                            <StyledTd><StyledButton onClick={() => setShowImage(prevShowImage => !prevShowImage)}>View</StyledButton></StyledTd>
                                        </tr>
                                    )
                                })}
                            </StyledTable>
                        </TextContent>
                        </Column1>
                        <Column2>
                            <ImgContainer>
                                {showImage && <Img src={img} alt='all' onClick={handleImageClick} />}
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
                            <TheMap gpxfile={file} thisEmail={email}/>
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

function Slider(data) {
    // https://zillow.github.io/react-slider/#reactslider
    // https://github.com/gpxstudio/gpxstudio.github.io/blob/master/js/slider.js
    return (
        <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-Thumb"
            trackClassName="customSlider-Track"
            defaultValue={[0, 50]}
            ariaLabel={['start', 'stop' ]}
            max={200}
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            pearling={false}
            minDistance={10}
        />
    );
}

function AddGpx(props) {
    const map = useMap();
    if (props.gpxfile === undefined) return;
    map.eachLayer(function (layer) {
        if (layer["_gpx"] !== undefined) map.removeLayer(layer);
    });
    new L.GPX(props.gpxfile, {
        async: true,
        drawControl: true,
        marker_options: {
            startIconUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-icon-start.png',
            endIconUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-icon-end.png',
            shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-shadow.png'
        }
    }).on('loaded', function (e) {
        map.fitBounds(e.target.getBounds());
        console.log(e);
    }).addTo(map);
}

function DrawControls({sendLatLngs}) {
    const map = useMap();
    if (drawLayers) return;
    else drawLayers = true;

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
    map.on(L.Draw.Event.DRAWSTART, function () {
        drawnItems.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        drawnItems = new L.FeatureGroup();
    });

    map.on(L.Draw.Event.CREATED, function(e) {
        let layer = e.layer;
        drawnItems.addLayer(layer);
        map.addLayer(layer);
        sendLatLngs(layer.getLatLngs());
    });
}

function TheMap (props) {
    const { email } = useContext(EmailContext);
    const [gameTitle, setGameTitle] = useState('');
    const [position, setPosition] = useState('');
    const [latLngs, setLatLngs] = useState(null);

    function handleLatLngs(data) {
        setLatLngs(data);
    }

    function SubmitGameData(e) {
        e.preventDefault();

        client.post(
            "/api/NewGame",
            {
                email: email,
                title: gameTitle,
                position: position,
                gpx: props.gpxfile,
                field: latLngs
            }
        ).then(function(res) {
            console.log("Successful POST. Reload gamedata table");
        });
    }
    return (
        <div>
            <Form onSubmit={e => SubmitGameData(e)}>
                <Form.Group className="mb-3" controlId="formGameTitle">
                    <Form.Label>Game Title</Form.Label>
                    <Form.Control placeholder="Enter title" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label>Position</Form.Label>
                    <Form.Control placeholder="Enter the position you played" value={position} onChange={e => setPosition(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">Submit New Game Data</Button>
                <div id="slide-container">

                    <input type="range" min="0" max="10000000" value="0" className="slider" id="start-point"/>
                    <input type="range" min="0" max="10000000" value="10000000" className="slider visible" id="end-point"/>
                </div>
                <div id="slider" padding="10px">
                    <Slider gpxFile={props.gpxfile}/>
                </div>
                <div id="map" padding={"10px"}>
                    <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <AddGpx gpxfile={props.gpxfile}/>
                        <DrawControls sendLatLngs={handleLatLngs}/>
                    </MapContainer>
                </div>
            </Form>

        </div>

    );
}