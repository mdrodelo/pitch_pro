import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountCreation.css'; // Import your CSS file

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

const AccountCreation = ({ history }) => {
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleCreateAccount = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: newEmail,
          password: newPassword,
        }),
      });

      if (response.ok) {
        // Account creation successful
        console.log('Account creation successful');

        // Redirect to the login page
        history.push('/login');
      } else {
        // Handle account creation error, display error message, etc.
        console.error('Account creation failed');
      }

      // Clear input fields regardless of success or failure
      setUsername('');
      setNewEmail('');
      setNewPassword('');
    } catch (error) {
      console.error('Error during account creation:', error);
    }
  };

  return (
    <div className="account-creation-container">
      <h2>Create a New Account</h2>
      <form>
        <div className="label-input">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="input-field"
          />
        </div>
        <div className="label-input">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="input-field"
          />
        </div>
        <div className="label-input">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="input-field"
          />
        </div>
        <button type="button" className="create-account-button" onClick={handleCreateAccount}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default AccountCreation;