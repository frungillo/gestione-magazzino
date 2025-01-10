import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBoxes, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import 'react-tooltip/dist/react-tooltip.css'; // Se usi react-tooltip
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getArticoli, getGiacenza } from '../services/api';
import EditArticolo from './EditArticolo';
import GiacenzeArticolo from './GiacenzeArticolo';
import { deleteArticolo } from '../services/api';
import '../styles/Articoli.css';


const Articoli = () => {
  const [articoli, setArticoli] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showGiacenzePopup, setShowGiacenzePopup] = useState(false);
  const [selectedArticolo, setSelectedArticolo] = useState(null);
  const { authToken } = useContext(AuthContext);

  // Funzione per recuperare gli articoli
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

  // Effetto per caricare gli articoli inizialmente
  useEffect(() => {
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
    setSelectedArticolo(articolo);
    setShowGiacenzePopup(true);
  };
  const handleDeleteArticolo = async (articolo) => {
    setSelectedArticolo(articolo);
    try {
      // Recupera la giacenza dell'articolo
      const giacenza = await getGiacenza(articolo.id_articolo, authToken);

      if (giacenza === -1) {
        // Cancellazione permessa
        const conferma = window.confirm(`Sei sicuro di voler cancellare l'articolo "${articolo.descrizione}"?`);
        if (conferma) {
          await deleteArticolo(articolo.id_articolo, authToken); // Chiama il servizio di cancellazione
          alert("Articolo cancellato con successo.");
          fetchArticoli(); // Aggiorna la lista degli articoli
        }
      } else {
        // Articolo con movimenti, non cancellabile
        alert("Articolo con Movimenti. Impossibile cancellare.");
      }
    } catch (error) {
      console.error("Errore durante la cancellazione dell'articolo:", error);
      alert("Errore durante la cancellazione dell'articolo. Riprova più tardi.");
    }
  };

  const handleMovimentiArticolo = (articolo) => {
    setSelectedArticolo(articolo);
    //setShowGiacenzePopup(true);
    // DA COMPLETARE
  };

  const handlePopupClose = () => {
    setShowEditPopup(false);
    setShowGiacenzePopup(false);
    fetchArticoli(); // Aggiorna la lista degli articoli
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
            <th>Codice</th>
            <th>Giacenza Totale</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {articoli.map((articolo) => (
            <tr key={articolo.id_articolo}>
              <td>{articolo.id_articolo}</td>
              <td>{articolo.descrizione}</td>
              <td>{articolo.note}</td>
              <td>{articolo.codice}</td>
              <td>{articolo.giacenza !== undefined ? articolo.giacenza : 'Caricamento...'}</td>
              <td>
                <button
                  className="btn btn-icon"
                  onClick={() => handleEditArticolo(articolo)}
                  data-tooltip-id={`tooltip-edit-${articolo.id_articolo}`}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <Tooltip id={`tooltip-edit-${articolo.id_articolo}`} content="Modifica" place="top" />

                <button
                  className="btn btn-icon"
                  onClick={() => handleGiacenzeArticolo(articolo)}
                  data-tooltip-id={`tooltip-giacenze-${articolo.id_articolo}`}
                >
                  <FontAwesomeIcon icon={faBoxes} />
                </button>
                <Tooltip id={`tooltip-giacenze-${articolo.id_articolo}`} content="Giacenze" place="top" />
                <button
                  className="btn btn-icon"
                  onClick={() => handleDeleteArticolo(articolo)}
                  data-tooltip-id={`tooltip-elimina-${articolo.id_articolo}`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <Tooltip id={`tooltip-elimina-${articolo.id_articolo}`} content="Elimina" place="top" />
                <button
                  className="btn btn-icon"
                  onClick={() => handleMovimentiArticolo(articolo)}
                  data-tooltip-id={`tooltip-movimenti-${articolo.id_articolo}`}
                >
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </button>
                <Tooltip id={`tooltip-movimenti-${articolo.id_articolo}`} content="Movimenti" place="top" />
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
      {showGiacenzePopup && (
        <GiacenzeArticolo
          articolo={selectedArticolo}
          onClose={handlePopupClose}
          authToken={authToken}
        />
      )}
    </div>
  );
};

export default Articoli;




