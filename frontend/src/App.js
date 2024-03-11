// https://www.freecodecamp.org/news/pass-data-between-components-in-react/ passing data to different components
// https://teamtreehouse.com/community/api-requests-for-a-react-site-with-multiple-pages
// https://www.digitalocean.com/community/tutorials/react-axios-react
// https://blog.devgenius.io/making-basic-http-get-requests-in-react-using-axios-53c73018213b not free, but if desperate
// https://www.bairesdev.com/blog/react-spa-single-page-application/ good overview of SPA vs MPA
import React from 'react';
import axios from "axios";
import {useEffect, useState} from "react";
import './App.css';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Home from './components/Home';
import About from './components/About';
import Instructions from './components/Instructions';
import MyData from './components/MyData';
import Login from './components/Login';
import AccountCreation from "./components/AccountCreation";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    client.get("/api/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);

  function update_form_btn() {
    if (registrationToggle) {
      document.getElementById("form_btn").innerHTML = "Register";
      setRegistrationToggle(false);
    } else {
      document.getElementById("form_btn").innerHTML = "Log in";
      setRegistrationToggle(true);
    }
  }

  function submitRegistration(e) {
    e.preventDefault();
    client.post(
        "/api/register",
        {
          email: email,
          username: username,
          password: password
        }
    ).then(function(res) {
      client.post(
          "/api/login",
          {
            email: email,
            password: password
          }
      ).then(function(res) {
        setCurrentUser(true);
      });
    });
  }

  function loginCallback(data) {
    console.log(data);
    //submitLogin(data);
  }
  function submitLogin(e) {
    e.preventDefault();
    client.post(
        "/api/login",
        {
          email: email,
          password: password
        }
    ).then(function(res) {
      setCurrentUser(true);
    });
  }

  function submitLogout(e) {
    e.preventDefault();
    client.post(
        "/api/logout",
        {withCredentials: true}
    ).then(function(res) {
      setCurrentUser(false);
    });
  }

  if (currentUser) {
    return (
        <BrowserRouter>
          <div className="App">
            <header className="App-header">
              <h1>PitchPro</h1>
              <nav className="nav-bar">
                <div className="left-nav">
                  <Link to="/" className="nav-link">HOME</Link>
                  <Link to="/mydata" className="nav-link">MY DATA</Link>
                </div>
                <form onSubmit={e => submitLogout(e)}>
                  <Button type="submit" variant="light">Log out</Button>
                </form>
              </nav>
            </header>
            <Routes>
              <Route path="/mydata" element={<MyData />} />
              <Route path="/" exact element={<Home />} />
              </Routes>
          </div>
        </BrowserRouter>
    );
  }
  return (
      <BrowserRouter>
          <div className="App">
            <header className="App-header">
              <h1>PitchPro</h1>
              <nav className="nav-bar">
                <div className="left-nav">
                  <Link to="/" className="nav-link">HOME</Link>

                </div>
                <div className="right-nav">
                  <Link to="/login" className="nav-link">LOGIN</Link>
                  <Button id="form_btn" onClick={update_form_btn} variant="light">Register</Button>
                </div>
              </nav>
            </header>
            {
              registrationToggle ? (
                  <div className="login-container" >
                    <Form onSubmit={e => submitRegistration(e)}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                      </Form.Group>
                      <Form.Group classname="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e =>setPassword(e.target.value)} />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </div>
              ) : (
                  <div className="login-container">
          <Form onSubmit={e => submitLogin(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
              )
            }
            {/*This is where the Home route is supposed to be to show up before a user logs in*/}
            {/*<Routes>*/}
            {/*  <Route path="/" exact element={<Home />} />*/}
            {/*  </Routes>*/}
          </div>
        </BrowserRouter>
  );
}




export default App;

/*import React from 'react';
import { useState, useEffect, Component} from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Instructions from './components/Instructions';
import MyData from './components/MyData';
import Login from './components/Login';
import AccountCreation from "./components/AccountCreation";
import './App.css';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  console.log(currentUser);

  useEffect(() => {
    client.get("/api/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);
  console.log(currentUser);

  if (currentUser) {
    return (
        <BrowserRouter>
          <div className="App">
            <header className="App-header">
              <h1>PitchPro</h1>
              <nav className="nav-bar">
                <div className="left-nav">
                  <Link to="/" className="nav-link">HOME</Link>
                  <Link to="/about" className="nav-link">ABOUT</Link>
                  <Link to="/instructions" className="nav-link">INSTRUCTIONS</Link>
                  <Link to="/mydata" className="nav-link">MY DATA</Link>
                </div>
                <div className="right-nav">
                  <Link to="/logout" className="nav-link">LOG OUT</Link>
                </div>
              </nav>
            </header>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/mydata" element={<MyData />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account-creation" element={<AccountCreation />} />
              <Route path="/" exact element={<Home />} />
              </Routes>
          </div>
        </BrowserRouter>
    );
  }
  return (
<BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>PitchPro</h1>
          <nav className="nav-bar">
            <div className="left-nav">
              <Link to="/" className="nav-link">HOME</Link>
              <Link to="/about" className="nav-link">ABOUT</Link>
              <Link to="/instructions" className="nav-link">INSTRUCTIONS</Link>
              <Link to="/mydata" className="nav-link">MY DATA</Link>
            </div>
            <div className="right-nav">
              <Link to="/login" className="nav-link">LOGIN</Link>
            </div>
          </nav>
        </header>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/mydata" element={<MyData />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account-creation" element={<AccountCreation />} />
          <Route path="/" exact element={<Home />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
*/
