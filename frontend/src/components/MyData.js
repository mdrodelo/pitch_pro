import React from 'react';
import { useState, useEffect, useMemo, useContext, Children } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { EmailContext } from '../App';
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

    function RefreshTable(e) {
        e.preventDefault();
        client.post("/api/gamedata",
        {
            email: email
        }).then(function(res) {
            setData(res.data);
        });
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
                            <button id="refresh-table" onClick={RefreshTable}>Refresh</button>
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

function OGSlider(props) {
    // https://zillow.github.io/react-slider/#reactslider
    // https://github.com/gpxstudio/gpxstudio.github.io/blob/master/js/slider.js
    const [length, setLength] = useState(200);
    useEffect(() => {
        if (props.gpxElement != null){
            setLength(props.gpxElement.length);
        }

        console.log(props.gpxElement);
        console.log(length);

    }, [props.gpxElement]);

    return (
        <div>
            <ReactSlider
                className="customSlider"
                thumbClassName="customSlider-Thumb"
                trackClassName="customSlider-Track"
                defaultValue={[0, 50]}
                ariaLabel={['start', 'stop' ]}
                max={length}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling={false}
                minDistance={10}
            />
            <br/>
            <table>
                <tr>
                    <td>Item 1</td>
                    <td>Item 2</td>
                </tr>
            </table>
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
    const [gpxElem, setGpxElem] = useState(null);
    const [timeArray, setTimeArray] = useState([]);
    const [sliderList, setSliderList] = useState([]);
    const [sliderArr, setSliderArr] = useState([]);

    function handleLatLngs(data) {
        setLatLngs(data);
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
        setSliderList(sliderList.concat(<Slider key={sliderList.length} index={sliderList.length} gpxElement={gpxElem} updateSliderArr={handleSliderArrUpdate}/>));
        console.log(sliderList.length);
    };

    function SubmitGameData(e) {
        e.preventDefault();

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
        ).then(function(res) {
            console.log("Successful POST. Reload gamedata table");
        });
        // https://mparavano.medium.com/find-filter-react-children-by-type-d9799fb78292
        console.log(sliderArr);
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
                <br/><br/>
                <Button type="button" onClick={onSliderBtnClick}>Add Slider</Button>
                <div id="sliders" padding="10px">
                    {sliderList}
                </div>
                <div id="map" padding={"10px"}>
                    <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <AddGpx gpxfile={props.gpxfile} sendGpxElem={handleGpxElem}/>
                        <DrawControls sendLatLngs={handleLatLngs}/>
                    </MapContainer>
                </div>
            </Form>
        </div>

    );
}