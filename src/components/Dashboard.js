import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/articoli">Gestione Articoli</Link></li>
        <li><Link to="/movimenti">Gestione Movimenti</Link></li>
        <li><Link to="/caratteristiche">Gestione Caratteristiche</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
