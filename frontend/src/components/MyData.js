import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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
        client.post(
            "/api/uploadgame",
            {
                title: "test",
                date: "01/02/2024",
                field_parameters: "-81, 28, -81.5, 29.5"
            }
        ).then(function(res) {
            console.log("Upload successful");
            console.log(res);
        });
    }

    return (
        <div>
            <div>MyData Screen Content</div>
            <button id="data_toggle" onClick={update_mydata_btn}>Upload</button>
            {
                addDataToggle ? (
                    <div>
                    <div>Add data</div>
                    <Form onSubmit={e => submitData(e)}>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
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