import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBoxes, faTrash, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import 'react-tooltip/dist/react-tooltip.css';
import Barcode from 'react-barcode';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getArticoli, getGiacenza, deleteArticolo } from '../services/api';
import EditArticolo from './EditArticolo';
import GiacenzeArticolo from './GiacenzeArticolo';
import MovimentiArticolo from './MovimentiArticolo'; // Nuovo componente
import '../styles/Articoli.css';

const Articoli = () => {
  const [articoli, setArticoli] = useState([]);
  const [filteredArticoli, setFilteredArticoli] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showGiacenzePopup, setShowGiacenzePopup] = useState(false);
  const [showMovimentiPopup, setShowMovimentiPopup] = useState(false); // Stato per il popup dei movimenti
  const [selectedArticolo, setSelectedArticolo] = useState(null);
  const [mostraSoloGiacenzaPositiva, setMostraSoloGiacenzaPositiva] = useState(false);
  const { authToken } = useContext(AuthContext);

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
      setFilteredArticoli(articoliConGiacenza);
    } catch (error) {
      console.error('Errore nel recupero degli articoli o della giacenza:', error);
    }
  };

  useEffect(() => {
    fetchArticoli();
  }, [authToken]);

  useEffect(() => {
    if (mostraSoloGiacenzaPositiva) {
      setFilteredArticoli(articoli.filter((articolo) => articolo.giacenza > 0));
    } else {
      setFilteredArticoli(articoli);
    }
  }, [mostraSoloGiacenzaPositiva, articoli]);

  const handleAddArticolo = () => {
    setSelectedArticolo(null);
    setShowEditPopup(true);
  };

  const handleEditArticolo = (articolo) => {
    setSelectedArticolo(articolo);
    setShowEditPopup(true);
  };

  const handleGiacenzeArticolo = (articolo) => {
    setSelectedArticolo(articolo);
    setShowGiacenzePopup(true);
  };

  const handleMovimentiArticolo = (articolo) => {
    setSelectedArticolo(articolo);
    console.log("movimentoarticolo", articolo);
    setShowMovimentiPopup(true); // Mostra il popup dei movimenti
  };

  const handleDeleteArticolo = async (articolo) => {
    setSelectedArticolo(articolo);
    try {
      const giacenza = await getGiacenza(articolo.id_articolo, authToken);

      if (giacenza === -1) {
        const conferma = window.confirm(`Sei sicuro di voler cancellare l'articolo "${articolo.descrizione}"?`);
        if (conferma) {
          await deleteArticolo(articolo.id_articolo, authToken);
          alert('Articolo cancellato con successo.');
          fetchArticoli();
        }
      } else {
        alert('Articolo con Movimenti. Impossibile cancellare.');
      }
    } catch (error) {
      console.error('Errore durante la cancellazione dell\'articolo:', error);
      alert('Errore durante la cancellazione dell\'articolo. Riprova più tardi.');
    }
  };

  const handlePopupClose = (updatedArticolo) => {
    if (updatedArticolo) {
      setArticoli((prev) =>
        prev.map((articolo) =>
          articolo.id_articolo === updatedArticolo.id_articolo
            ? updatedArticolo
            : articolo
        )
      );
    }
    setShowEditPopup(false);
    setShowGiacenzePopup(false);
    setShowMovimentiPopup(false); // Chiude il popup dei movimenti
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Gestione Articoli</h2>
        <div className="header-buttons">
          <div className="filter-section">
            <label>
              <input
                type="checkbox"
                checked={mostraSoloGiacenzaPositiva}
                onChange={(e) => setMostraSoloGiacenzaPositiva(e.target.checked)}
              />
              Mostra solo Articoli a Giacenza Positiva
            </label>
          </div>
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
            <th>BarCode</th>
            <th>Giacenza Totale</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticoli.map((articolo) => (
            <tr key={articolo.id_articolo}>
              <td>{articolo.id_articolo}</td>
              <td>{articolo.descrizione}</td>
              <td>{articolo.note}</td>
              <td>{articolo.codice}</td>
              <td>
                {articolo.codice && (
                  <Barcode
                    value={articolo.codice}
                    width={2}
                    height={40}
                    displayValue={true}
                  />
                )}
              </td>
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
                  <FontAwesomeIcon icon={faRightLeft} />
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
      {showMovimentiPopup && (
        <MovimentiArticolo
          articolo={selectedArticolo}
          onClose={handlePopupClose}
          authToken={authToken}
        />
      )}
    </div>
  );
};

export default Articoli;






