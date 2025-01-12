import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsTurnToDots, faBox, faExchangeAlt, faTags } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-menu">
        <Link to="/articoli" className="dashboard-item">
          <FontAwesomeIcon icon={faBox} className="dashboard-icon" />
          <span>Gestione Articoli</span>
        </Link>
        <Link to="/movimenti" className="dashboard-item">
          <FontAwesomeIcon icon={faExchangeAlt} className="dashboard-icon" />
          <span>Gestione Movimenti</span>
        </Link>
        <Link to="/caratteristiche" className="dashboard-item">
          <FontAwesomeIcon icon={faTags} className="dashboard-icon" />
          <span>Gestione Caratteristiche</span>
        </Link>
        <Link to="/tipomovimento" className="dashboard-item">
          <FontAwesomeIcon icon={faArrowsTurnToDots} className="dashboard-icon" />
          <span>Tipo Movimento</span>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;

