// https://www.freecodecamp.org/news/pass-data-between-components-in-react/ passing data to different components
// https://teamtreehouse.com/community/api-requests-for-a-react-site-with-multiple-pages
// https://www.digitalocean.com/community/tutorials/react-axios-react
// https://blog.devgenius.io/making-basic-http-get-requests-in-react-using-axios-53c73018213b not free, but if desperate
// https://www.bairesdev.com/blog/react-spa-single-page-application/ good overview of SPA vs MPA
import React from 'react';
import axios from "axios";
import {useEffect, useState} from "react";
import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from './components/Home';
import MyData from './components/MyData';
import Login from './components/Login';
import { useNavigate } from 'react-router-dom';

/* OG
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

 */

function App() {
  const [currentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    client.get("/api/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);

  function loginCallback(data) {
    console.log(data);
    //submitLogin(data);
  }

  return (
    <BrowserRouter>
      {currentUser ? (
        <div className="App">
          <Routes>
            <Route path="/" exact element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/mydata" element={<MyData />} />
          </Routes>
        </div>
      ) : (
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}
    
 




export default App;