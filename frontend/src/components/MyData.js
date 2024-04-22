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
import styled, { keyframes } from 'styled-components';
import Heatmap from './Heatmap';
import client from "./api";
import { EmailContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Slider from "./Slider";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HomeContainer = styled.div`
    color: #fff;
    background-color: #030c12;
    animation: ${fadeIn} 1s ease-out;
`;

const SectionContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const MapWrapper = styled.div`
  height: 400px; // Adjust this height to fit within your overall form or section
  width: 100%;  // Ensures the map container takes up only the available width
  padding: 10px;
  background: #1b2838; // A subtly lighter shade of grey-blue
  border-radius: 8px;  // Optional: for styling
  overflow: hidden;  // Ensures nothing extends outside the boundaries
`;

const UnifiedFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #030c12;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  margin-bottom: 20px;
`;

const Label = styled(Form.Label)`
  font-size: 18px; // Slightly larger for emphasis
  font-weight: bold; // Bold for label emphasis
  color: #fff; // White to distinguish from input text but maintain readability
  margin-right: 5px; // Space between label and input field
`;

const StyledForm = styled(Form)`
  background: #1b2838; // A subtly lighter shade of grey-blue
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
`;

const GameLogSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;  // This will ensure that each column takes half the width
    align-items: start;  // Aligns items at the start of the grid area
    gap: 20px;  // Adds space between the columns
`;

const GameInfoCard = styled.div`
    background: #1b2838; // A subtly lighter shade of grey-blue
    color: #ddd; // For readability against the darker background
    padding: 20px 25px; // Increased padding for a more spacious feel
    border-radius: 10px; // Rounded corners for a softer, modern look
    box-shadow: 0 6px 20px rgba(0,0,0,0.5); // Enhanced depth with a stronger shadow
    margin: 10px 0; // Provides space between cards, adjust as needed
    transition: transform 0.3s ease-in-out; // Smooth transition for hover effects

    &:hover {
        transform: scale(1.03); // Slight enlargement on hover for visual feedback
        box-shadow: 0 10px 25px rgba(0,0,0,0.6); // Increased shadow on hover for added depth
    }
`;

const NewGameSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Img = styled.img`
    width: 100%;
    max-height: 500px;  // Limits the image height
    object-fit: cover; 
`;

const StyledButton = styled(Button)`
    background-color: #4a90e2; // A vibrant blue that stands out but still fits with the overall theme
    color: white; // White text
    border: none;
    padding: 10px 20px; // Padding for better touch area
    border-radius: 5px; // Rounded corners
    font-size: 16px; // Larger font size for readability
    font-weight: bold; // Bold font for better visibility
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // Subtle shadow for 3D effect
    transition: all 0.3s ease-in-out; // Smooth transition for hover effects
    margin-right: 5px; // Space between buttons

    &:hover {
        background-color: #357abD; // Darker shade of the original color on hover
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // Larger shadow on hover for a "lifted" effect
        transform: translateY(-2px); // Slight raise on hover
    }

    &:active {
        background-color: #303F9F; // Even darker for the active state
        transform: translateY(1px); // Push down effect on click
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // Reset shadow to original on click
    }
`;

const CardTitle = styled.h2`
  color: #EAF0F1; // Brighter color for higher contrast
  font-size: 22px; // Larger font size for titles
  font-weight: bold; // Bold to make it stand out
  margin-bottom: 8px; // Space below the title
`;

const Text = styled.p`
  color: #CAD3C8; // Slightly lighter than the body text for differentiation
  font-size: 16px; // Comfortable reading size
  line-height: 1.4; // Adequate line spacing for readability
  font-weight: bold; // Bold to make it stand out
  margin-bottom: 5px; // Space between paragraphs
`;

const StyledInput = styled(Form.Control)`
  background-color: #333; // Dark background for the input
  color: #ddd; // Light color for the text
  border: 1px solid #555; // Subtle border color
  border-radius: 4px; // Rounded corners for a modern look
  padding: 10px; // Adequate padding inside the inputs
  margin-bottom: 15px; // Space below each input
  margin-right: 5px; // Space between input and button

  &:hover {
    border-color: #777; // Change border on hover for a visual feedback
  }

  &:focus {
    border-color: #abdae4; // Highlight color for focus
    box-shadow: 0 0 5px rgba(171, 218, 228, 0.5); // Glow effect for focus
    outline: none; // Remove default focus outline
  }
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
        console.log(e)
        if (e.target.files.length === 0) {
            setFile(undefined);
        }
        else {
            let fileReader = new FileReader();
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
                        <UnifiedFormContainer>
                            <StyledForm>
                                <Form.Group controlId="fileUpload">
                                    <Label>Upload GPX Data</Label>
                                    <StyledInput type="file" accept=".gpx" onChange={handleFileChange} />
                                    <StyledButton onClick={() => console.log('Processing GPX Data...')}>Upload</StyledButton>
                                </Form.Group>
                            </StyledForm>
                            <TheMap gpxfile={file} thisEmail={email} setData={setData} />
                        </UnifiedFormContainer>
                    </NewGameSection>
                </SectionContainer>
            </HomeContainer>
            <HomeContainer>
                <SectionContainer>
                    <GameLogSection id="my-data-section">
                        {data.map(game => (
                            <GameInfoCard key={game.game_id}>
                                <CardTitle>{game.game_title}</CardTitle>
                                <Text>{game.game_date}</Text>
                                <Text>{game.position}</Text>
                                {gameId != game.game_id && <StyledButton onClick={(e) => handleViewClick(e, game.game_id)}>View</StyledButton>}
                                {gameId === game.game_id && <Heatmap id={game.game_id}/>}
                            </GameInfoCard>                                
                        ))}   
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
            console.log(e);
            //console.log(e.element.children[0].children[1].children[1].children)
            props.sendGpxElem(e.element.children[0].children[1].children[1].children);

        }).addTo(map);
    }, [props.gpxfile]);
}

function DrawControls({ sendLatLngs }) {
    const map = useMap();

    var drawnItems = new L.FeatureGroup();
    map.on(L.Draw.Event.DRAWSTART, function () {
        drawnItems.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        drawnItems = new L.FeatureGroup();
    });

    map.on(L.Draw.Event.CREATED, function (e) {
        let layer = e.layer;
        layer.options.color = '#D41159';
        layer.options.fillColor = '#D41159';
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
    const [sliderArr, setSliderArr] = useState({});

    useEffect(() => {
        onClearSlidersClick();
    }, [props.gpxfile]);

    function handleLatLngs(e) {
        setLatLngs(e);
    }

    function handleGpxElem(e) {
        setGpxElem(e);
    }

    function handleSliderArrUpdate(e) {
        let check = sliderArr[e[0]][2];
        sliderArr[e[0]] = [e[1], e[2], check];
    }

    const onClearSlidersClick = event => {
        setSliderList([]);
        setSliderArr({});
    }

    const onSliderBtnClick = event => {
        //https://codesandbox.io/p/sandbox/add-react-component-onclick-oery4?file=%2Fsrc%2Findex.js%3A14%2C1
        setSliderList(sliderList.concat(<Slider key={sliderList.length} index={sliderList.length} gpxElement={gpxElem} updateSliderArr={handleSliderArrUpdate}/>));
        if (sliderList.length >= 1)
            sliderArr[sliderList.length] = [-1, 1, sliderArr[sliderList.length - 1][2] ? false : true];
        else
            sliderArr[sliderList.length] = [-1, 1, false];
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
        <>
            <StyledForm onSubmit={e => { SubmitGameData(e); setGameTitle(''); setPosition(''); setLatLngs(null); }}>
                <Form.Group className="mb-3" controlId="formGameTitle">
                    <Label>Game Title</Label>
                    <StyledInput style={{ background: '#333', color: '#ddd' }} placeholder="Enter title" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPosition">
                    <Label>Position</Label>
                    <StyledInput style={{ background: '#333', color: '#ddd' }} placeholder="Enter the position you played" value={position} onChange={e => setPosition(e.target.value)} />
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label>TimeStamp</Form.Label>
                    <Form.Control placeholder="Enter time (HH:MM:SS)" value={position} onChange={e => setPosition(e.target.value)} />
                    <Form.Control placeholder="Enter time (HH:MM:SS)" value={position} onChange={e => setPosition(e.target.value)} />
                </Form.Group> */}
                <br/>
                <StyledButton type="button" onClick={onSliderBtnClick} disabled={props.gpxfile === undefined ? true : false}>Add Slider</StyledButton>
                <StyledButton type="button" onClick={onClearSlidersClick} disabled={props.gpxfile === undefined ? true : false}>Clear *ALL* Sliders</StyledButton>

                <div id="sliders" padding="10px">
                    {sliderList}
                </div>
                <br/>
                <StyledButton type="submit">Submit New Game Data</StyledButton>
                
                <MapWrapper>
                    <MapContainer drawControl={true} center={[51.55613140200256, -0.27958551642058616]} zoom={17} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <AddGpx gpxfile={props.gpxfile} sendGpxElem={handleGpxElem} />
                        <DrawControls sendLatLngs={handleLatLngs} />
                    </MapContainer>
                </MapWrapper>
            </StyledForm>
        </>

    );
}