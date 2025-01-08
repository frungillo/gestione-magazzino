import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../services/base';
import { useNavigate } from 'react-router-dom';


const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("utente", username);
      console.log("password", password);
      const response = await axios.post(`${API_URL}/Utente/loginUtente`, {
        "username":username,
        "password_hash":password,
      });
      login(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Errore di autenticazione', error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Accedi
        </button>
      </form>
    </div>
  );
};

export default Login;
