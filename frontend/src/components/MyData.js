import React from 'react';
import { useState, useEffect, useMemo, useContext, createContext, Children } from 'react';
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
import Heatmap from './Heatmap';
import client from "./api";
import { EmailContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Slider from "./Slider";

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
    grid-template-columns: 2fr 1fr;
    grid-auto-columns: minmax(auto, 1fr);
    align-items: center;
    grid-template-areas: 'col1 col2';
`;

const NewGameSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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

// const StyledTable = styled.table`
//     width: 100%;
//     border-collapse: collapse;
//     color: #f7f8fa;
// `;

// const StyledTh = styled.th`
//     border: 1px solid #ddd;
//     padding: 8px;
//     text-align: left;
//     background-color: #4CAF50;
//     color: white;
// `;

// const StyledTd = styled.td`
//     border: 1px solid #ddd;
//     padding: 8px;
//     color: white;
// `;

const StyledTable = styled.table`
    width: 800px;  // Adjust width as needed
    margin: 0 auto; // Center table on the page
    border-collapse: collapse;
    border-spacing: 0 1em;
    color: #f7f8fa;
    font-size: 1rem;
    table-layout: fixed; // Use this to keep columns fixed
`;

const StyledTh = styled.th`
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
`;

const StyledTd = styled.td`
    border: 1px solid #ddd;
    padding: 12px;
    color: white;
    word-wrap: break-word; // Prevents text from overflowing
`;

const AddDataDiv = styled.div`
    font-size: 18px;
    font-weight: 800;
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

const StyledInput = styled.input`
    display: block;
    margin: 20px 0;
    padding: 10px;
    font-size: 16px;
`;

let drawLayers = false;

export default function MyData() {
    const navigate = useNavigate();
    const { email } = useContext(EmailContext);
    const [file, setFile] = useState(undefined);
    const [data, setData] = useState([]);
    const [gameId, setGameId] = useState(-1);

    const handleViewClick = (e, value) => {
        setGameId(value);
        e.preventDefault();
    }

    function handleFileChange(e) {
        let fileReader = new FileReader();
        setFile(e.target.result);
        fileReader.onload = function (e) {
            setFile(e.target.result);
            fileReader.onload = function (e) {
                setFile(e.target.result);
            }
            fileReader.readAsText(e.target.files[0], "UTF-8");
        }
    }

    useEffect(() => {
        client.post("/api/gamedata",
            {
                email: email
            })
            .then(function (res) {
                setData(res.data);
                //data = res.data;
            });
    }, []);

    return (
        <div>
            <HomeContainer>
                <SectionContainer>
                    <NewGameSection id="add-data-section">
                        <AddDataDiv>Add data</AddDataDiv>
                        <StyledInput type="file" accept='.gpx' onChange={handleFileChange} />
                        <TheMap gpxfile={file} thisEmail={email} setData={setData} />
                    </NewGameSection>
                </SectionContainer>
            </HomeContainer>
            <HomeContainer>
                <SectionContainer>
                    <GameLogSection id="my-data-section">
                        <Column1>
                            <TextContent>
                                <StyledTable>
                                    <thead>
                                        <tr>
                                            <StyledTh>Title</StyledTh>
                                            <StyledTh>Date</StyledTh>
                                            <StyledTh>Position</StyledTh>
                                            <StyledTh>Duration</StyledTh>
                                            <StyledTh>View</StyledTh>
                                            <StyledTh>Delete</StyledTh>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((val, key) => {
                                            return (
                                                <tr key={val.game_id}>
                                                    <StyledTd>{val.game_title}</StyledTd>
                                                    <StyledTd>{val.game_date}</StyledTd>
                                                    <StyledTd>{val.position}</StyledTd>
                                                    <StyledTd>{val.duration}</StyledTd>
                                                    <StyledTd><StyledButton onClick={e => handleViewClick(e, val.game_id)}>View</StyledButton></StyledTd>
                                                    <StyledTd><StyledButton>Delete</StyledButton></StyledTd>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </StyledTable>
                            </TextContent>
                        </Column1>
                        <Column2>
                            <ImgContainer>
                                <Heatmap id={gameId} />
                            </ImgContainer>
                        </Column2>
                    </GameLogSection>
                </SectionContainer>
            </HomeContainer>
        </div>
    );
}

function AddGpx(props) {
    const map = useMap();
    useEffect(() => {
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
            //console.log(e); // TODO set value for context here?
            //console.log(e.element.children[0].children[1].children[1].children)
            //setGpxElem(e);
            props.sendGpxElem(e.element.children[0].children[1].children[1].children);

        }).addTo(map);
    }, [props.gpxfile]);
}

function DrawControls({ sendLatLngs }) {
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

    map.on(L.Draw.Event.CREATED, function (e) {
        let layer = e.layer;
        drawnItems.addLayer(layer);
        map.addLayer(layer);
        sendLatLngs(layer.getLatLngs());
    });
}

function TheMap(props) {
    const { email } = useContext(EmailContext);
    const [gameTitle, setGameTitle] = useState('');
    const [position, setPosition] = useState('');
    const [latLngs, setLatLngs] = useState(null);
    const [gpxElem, setGpxElem] = useState(null);
    const [timeArray, setTimeArray] = useState([]);
    const [sliderList, setSliderList] = useState([]);
    const [sliderArr, setSliderArr] = useState([]);
    const [sliderDisabled, setSliderDisabled] = useState(true);

    useEffect(() => {
        if (props.gpxfile === undefined) {
            setSliderDisabled(true);
        }
        else {
            setSliderDisabled(false);
        }
    }, [props.gpxfile]);

    function handleLatLngs(e) {
        setLatLngs(e);
    }

    function handleGpxElem(e) {
        setGpxElem(e);
    }

    function handleSliderArrUpdate(e) {
        sliderArr[e[0]] = [e[1], e[2], e[3]];
    }

    const onSliderBtnClick = event => {
        sliderArr.push([-1, 1, 0]);
        //https://codesandbox.io/p/sandbox/add-react-component-onclick-oery4?file=%2Fsrc%2Findex.js%3A14%2C1
        setSliderList(sliderList.concat(<Slider key={sliderList.length} index={sliderList.length} gpxElement={gpxElem} updateSliderArr={handleSliderArrUpdate} />));
        console.log(sliderList.length);
    };

    function SubmitGameData(e) {
        e.preventDefault();

        let missingFields = [];
        if (!gameTitle) missingFields.push("Game Title");
        if (!position) missingFields.push("Position");
        if (!props.gpxfile) missingFields.push("GPX File");
        if (!latLngs) missingFields.push("Field Polygon Drawing.");

        if (missingFields.length > 0) {
            let alertMessage = "Missing or invalid fields: " + missingFields.join(", ");
            if (!latLngs) {
                alertMessage += "\nPlease use the polygon tool to draw the estimated field on the map.";
            }
            alert(alertMessage);
            return;
        }

        client.post(
            "/api/NewGame",
            {
                email: email,
                title: gameTitle,
                position: position,
                gpx: props.gpxfile,
                field: latLngs,
                events: sliderArr
            }
        ).then(function (res) {
            console.log("Successful POST. Reload gamedata table");
            // After successfully posting new game data, fetch the updated data
            client.post("/api/gamedata", { email: email })
                .then(function (res) {
                    props.setData(res.data);
                });
        });



    }

    return (
        <div>
            <Form onSubmit={e => { SubmitGameData(e); setGameTitle(''); setPosition(''); setLatLngs(null); }}>

                <Form.Group className="mb-3" controlId="formGameTitle">
                    <Form.Label>Game Title</Form.Label>
                    <Form.Control style={{ color: 'black' }} placeholder="Enter title" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label>Position</Form.Label>
                    <Form.Control style={{ color: 'black' }} placeholder="Enter the position you played" value={position} onChange={e => setPosition(e.target.value)} />
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label>TimeStamp</Form.Label>
                    <Form.Control placeholder="Enter time (HH:MM:SS)" value={position} onChange={e => setPosition(e.target.value)} />
                    <Form.Control placeholder="Enter time (HH:MM:SS)" value={position} onChange={e => setPosition(e.target.value)} />
                </Form.Group> */}
                <Button style={{ color: 'black' }} variant="primary" type="submit">Submit New Game Data</Button>
                <br /><br />
                <Button style={{ color: 'black' }} type="button" onClick={onSliderBtnClick}>Add Slider</Button>
                <div id="sliders" padding="10px">
                    {sliderList}
                </div>
                <Button style={{ color: 'black' }} variant="primary" type="submit">Submit New Game Data</Button>
                <div id="map" padding={"10px"}>
                    <MapContainer center={[51.55613140200256, -0.27958551642058616]} zoom={17} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <AddGpx gpxfile={props.gpxfile} sendGpxElem={handleGpxElem} />
                        <DrawControls sendLatLngs={handleLatLngs} />
                    </MapContainer>
                </div>
            </Form>
        </div>

    );
}