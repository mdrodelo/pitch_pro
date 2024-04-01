import React from 'react';
import { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import ReactSlider from 'react-slider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './MyData.css';
import client from "./api";

let drawLayers = false;

let data = []

export default function MyData() {
    const [addDataToggle, setAddDataToggle] = useState(false);
    const [file, setFile] = useState(undefined);

    function handleFileChange(e) {
        let fileReader = new FileReader();
        setFile(e.target.result);
        fileReader.onload = function(e)  {
            setFile(e.target.result);
        }
        fileReader.readAsText(e.target.files[0], "UTF-8");
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

    client.post("/api/gamedata",
        {
            user:1 // TODO hardcoded. Need to fix
        })
        .then(function(res) {
            console.log(res);
            data = res.data;
        });

    return (
        <div>
            <div>MyData Screen Content</div>
            <button id="data_toggle" onClick={update_mydata_btn}>Upload</button>
            {
                addDataToggle ? (
                    <div>
                        <div>Add data</div>
                        <input type="file" accept='.gpx' onChange={handleFileChange}/>
                        <TheMap gpxfile={file}/>

                    </div>
                ) : (
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
                )
            }
        </div>
    );
}

function Slider(data) {
    // https://zillow.github.io/react-slider/#reactslider
    return (
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="timestamp"
            trackClassName="segment"
            defaultValue={[0, 50]}
            ariaLabel={['start', 'stop' ]}
            max={200}
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            pearling={false}
            minDistance={2}
        />
    );
}

function AddGpx(data) {
    const map = useMap();
    if (data.gpxfile === undefined) return;
    map.eachLayer(function (layer) {
        if (layer["_gpx"] !== undefined) map.removeLayer(layer);
    });
    new L.GPX(data.gpxfile, {
        async: true,
        drawControl: true,
        marker_options: {
            startIconUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-icon-start.png',
            endIconUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-icon-end.png',
            shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/pin-shadow.png'
        }
    }).on('loaded', function (e) {
        map.fitBounds(e.target.getBounds());
    }).addTo(map);
}

function DrawControls() {
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

    map.on(L.Draw.Event.CREATED, function(e) {
        let layer = e.layer;
        drawnItems.addLayer(layer);
    });
}

function TheMap (data) {
    const [gameTitle, setGameTitle] = useState('');
    const [position, setPosition] = useState('');
    function submitGameData(e) {
        e.preventDefault();
        console.log(gameTitle);
        client.post(
            "/api/NewGame",
            {
                title: gameTitle,
                position: position,
                gpx: data.gpxfile
            }
        ).then(function(res) {
            console.log("Successful POST. Reload gamedata table");
        });
    }
    return (
        <div>
            <Form onSubmit={e => submitGameData(e)}>
                <Form.Group className="mb-3" controlId="formGameTitle">
                    <Form.Label>Game Title</Form.Label>
                    <Form.Control placeholder="Enter title" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label>Position</Form.Label>
                    <Form.Control placeholder="Enter the position you played" value={position} onChange={e => setPosition(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">Submit New Game Data</Button>
                <div id="slider" padding="10px">
                    <Slider gpxFile={data.gpxfile}/>
                </div>
                <div id="map" padding={"10px"}>
                    <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <AddGpx gpxfile={data.gpxfile}/>
                        <DrawControls />
                    </MapContainer>
                </div>
            </Form>

        </div>

    );
}