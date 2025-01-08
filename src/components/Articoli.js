import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getArticoli, getGiacenza } from '../services/api';
import EditArticolo from './EditArticolo'; // Import del nuovo componente
//import GiacenzeArticolo from '.GiacenzeArticolo';
import '../styles/Articoli.css';

const Articoli = () => {
  const [articoli, setArticoli] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showGiacenzePopup, setShowGiacenzePopup] = useState(false);
  const [selectedArticolo, setSelectedArticolo] = useState(null);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticoli = async () => {
      try {
        const data = await getArticoli(authToken);
        const articoliConGiacenza = await Promise.all(
          data.map(async (articolo) => {
            const giacenza = await getGiacenza(articolo.id_articolo, authToken);
            return { ...articolo, giacenza };
          })
        );
        setArticoli(articoliConGiacenza);
      } catch (error) {
        console.error('Errore nel recupero degli articoli o della giacenza:', error);
      }
    };

    fetchArticoli();
  }, [authToken]);

  const handleAddArticolo = () => {
    setSelectedArticolo(null); // Aggiunta di un nuovo articolo
    setShowEditPopup(true);
  };

  const handleEditArticolo = (articolo) => {
    setSelectedArticolo(articolo); // Modifica articolo esistente
    setShowEditPopup(true);
  };

  const handleGiacenzeArticolo = (articolo) => {
    setSelectedArticolo(articolo); // Modifica articolo esistente
    setShowGiacenzePopup(true);
  };

  const handlePopupClose = () => {
    setShowEditPopup(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Gestione Articoli</h2>
        <div className="header-buttons">
          <button
            className="btn btn-success add-article-button"
            onClick={handleAddArticolo}
          >
            Aggiungi Articolo
          </button>
          <Link to="/dashboard" className="btn btn-primary dashboard-button">
            Dashboard
          </Link>

        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrizione</th>
            <th>Note</th>
            <th>Giacenza</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {articoli.map((articolo) => (
            <tr key={articolo.id_articolo}>
              <td>{articolo.id_articolo}</td>
              <td>{articolo.descrizione}</td>
              <td>{articolo.note}</td>
              <td>{articolo.giacenza !== undefined ? articolo.giacenza : 'Caricamento...'}</td>
              <td>
                <button
                  className="btn btn-warning edit-button"
                  onClick={() => handleEditArticolo(articolo)}
                >
                  Modifica
                </button>
                <button
                  className="btn btn-warning edit-button"
                  onClick={() => handleGiacenzeArticolo(articolo)}
                >
                  Giacenze
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEditPopup && (
        <EditArticolo
          articolo={selectedArticolo}
          onClose={handlePopupClose}
          authToken={authToken}
        />
      )}
    </div>
  );
};

export default Articoli;



