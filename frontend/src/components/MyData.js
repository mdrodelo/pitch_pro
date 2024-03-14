import React from 'react';
import { useState } from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './MyData.css';
import axios from "axios";

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
    const [file, setFile] = useState();

    function handleFileChange(e) {
        setFile(e.target.files[0]);
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

    function submitData(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        //formData.append('fileName', file.name);

    }

    return (
        <div>
            <div>MyData Screen Content</div>
            <button id="data_toggle" onClick={update_mydata_btn}>Upload</button>
            {
                addDataToggle ? (
                    <div>
                        <div>Add data</div>
                        <Form onSubmit={submitData}>
                            <input type="file" onChange={handleFileChange}/>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                        <div id="map"></div>
                        <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={false}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[51.505, -0.09]}>
                                <Popup>
                                    CSS3 popup.
                                </Popup>
                            </Marker>
                        </MapContainer>

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