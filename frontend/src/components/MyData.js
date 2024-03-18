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


const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

const data = [
    {title: "game 1", "date": "12/12/2023"},
    {title: "game 2", "date": "12/20/2023"},
    {title: "game 3", "date": "1/12/2024"},
]

function MyData() {
    const [addDataToggle, setAddDataToggle] = useState(false);
    const [file, setFile] = useState(null);

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

            new L.GPX(file, {
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

        //setFile(e.target.files[0]);
        //CreateGpxPolyline();

    }

    function update_mydata_btn() {
        if (addDataToggle) {
            document.getElementById("data_toggle").innerHTML = "Upload New Game";
            setAddDataToggle(false);
        } else {
            document.getElementById("data_toggle").innerHTML = "View Data";
            setAddDataToggle(true);
        }
    }

    return (
        <div>
            <div>MyData Screen Content</div>
            <button id="data_toggle" onClick={update_mydata_btn}>Upload</button>
            {
                addDataToggle ? (
                    <div>
                        <div>Add data</div>
                        <input type="file" accept='.gpx' onChange={handleFileChange}/>
                        <div id="map"></div>
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
                                    <td>{val.title}</td>
                                    <td>{val.date}</td>
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

export default MyData;