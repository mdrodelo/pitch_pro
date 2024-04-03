import React, { useEffect, useState }from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import your CSS file
import { FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import client from "./api";

function Login({currentUser, setCurrentUser}) {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  function submitLogin(e) {
    e.preventDefault();
    client.post(
        "/api/login",
        {
          email: email,
          password: password
        }
    ).then(function(res) {
      console.log('Server response:', res);
      setCurrentUser(true);
      navigate('/', { replace: true });
    })
    .catch(function(error) {
      console.error('Error during login:', error);
    });
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
        console.log('Server response:', res);
        setCurrentUser(true);
        navigate('/', { replace: true });
      });
    });
  }

  useEffect(() => {
    document.body.classList.add("login");
  
    return () => {
      document.body.classList.remove("login");
    };
  }, []);

  const togglePanel = (action) => {
    const container = document.getElementById('myContainer');
    if (container) {
      if (action === 'add') {
        container.classList.add('active');
      } else if (action === 'remove') {
        container.classList.remove('active');
      }
    }
  };

  return (
    <div className="container" id="myContainer">
      <div className="close-icon">
        <Link to="/">
          <FaTimes color="#76E4E0" size="1.5em"/>
        </Link>
      </div>
      <div className="login-container">
        <form onSubmit={e => submitLogin(e)}>
          <h1>Sign In</h1>
          <div className="input-box">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div className="input-box">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          </div>
          <button type="submit">LOGIN</button>
        </form>   
      </div>
      <div className="registration-container">
        <form onSubmit={e => submitRegistration(e)}>
          <h1>Create Account</h1>
          <div className="input-box">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
          </div>
          <div className="input-box">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div className="input-box">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />  
          </div>
          <button type="submit">SIGN UP</button>
        </form>   
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button id="signIn" className="hidden" type="button" onClick={() => togglePanel('remove')}>SIGN IN</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button id="signUp" className="hidden" type="button" onClick={() => togglePanel('add')}>SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;