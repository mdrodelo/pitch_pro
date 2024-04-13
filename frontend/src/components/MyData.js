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
import client from "./api";

let drawLayers = false;


export default function MyData(props) {
    const [addDataToggle, setAddDataToggle] = useState(false);
    const [file, setFile] = useState(undefined);
    const [data, setData] = useState([]);

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
            email: props.thisEmail
        }).then(function(res) {
            setData(res.data);
            //data = res.data;
        });
    }

    function update_mydata_btn() {
        if (addDataToggle) {
            document.getElementById("data_toggle").innerHTML = "Upload New Game";
            setAddDataToggle(false);
        } else {
            document.getElementById("data_toggle").innerHTML = "View Data";
            setAddDataToggle(true);
            drawLayers = false;
        }
    }
    useEffect(() =>  {
        client.post("/api/gamedata",
        {
            email: props.thisEmail
        })
        .then(function(res) {
            setData(res.data);
            //data = res.data;
        });
    }, []);

    return (
        <div>
            <div>MyData Screen Content</div>
            <button id="data_toggle" onClick={update_mydata_btn}>Upload</button>
            {
                addDataToggle ? (
                    <div>
                        <div>Add data</div>
                        <input type="file" accept='.gpx' onChange={handleFileChange}/>
                        <TheMap gpxfile={file} thisEmail={props.thisEmail}/>

                    </div>
                ) : (
                    <jsx>
                        <button id="refresh-table" onClick={RefreshTable}>Refresh</button>
                        <table>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                            {data.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{val.game_title}</td>
                                        <td>{val.game_date}</td>
                                        <td><button>View</button></td>
                                    </tr>
                                )
                            })}
                        </table>
                    </jsx>
                )
            }
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
                email: props.thisEmail,
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