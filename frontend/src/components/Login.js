import React, { useEffect, useState }from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import your CSS file

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function Login() {
  const [currentUser, setCurrentUser] = useState();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  /*useEffect(() => {
    client.get("api/user")
        .then(function(res) {
          setCurrentUser(true);
        })
        .catch(function(error) {
          setCurrentUser(false);
        });
  }, []);*/
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful
        console.log('Login successful');



        // Redirect or perform other actions after successful login
        // For example, you can redirect to the home page:
        navigate('/');
      } else {
        // Handle login error, display error message, etc.
        console.error('Login failed');
      }
      // Clear input fields
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleCreateAccount = () => {
    navigate('/account-creation');
  };

  return (
    <div className="login-container">
      <h2>Log Into PitchPro</h2>
      <form>
        <label className="label-input">
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>
        <label className="label-input">
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <button type="button" className="login-button" onClick={handleLogin}>
          Log In
        </button>
        <button type="button" className="create-account-button" onClick={handleCreateAccount}>
          Create new Account
        </button>
      </form>
    </div>
  );
};

export default Login;