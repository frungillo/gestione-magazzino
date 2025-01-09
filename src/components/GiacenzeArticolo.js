import React, { useEffect, useState } from 'react';
import { getDettaglioGiacenza} from '../services/api'; // Funzione API per recuperare le giacenze per caratteristica
import '../styles/GiacenzeArticolo.css';

const GiacenzeArticolo = ({ articolo, onClose, authToken }) => {
  const [giacenze, setGiacenze] = useState([]);

  useEffect(() => {
    const fetchGiacenze = async () => {
      try {
        console.log("from popup",articolo.id_articolo)
        const data = await getDettaglioGiacenza(articolo.id_articolo, authToken);
        setGiacenze(data);
      } catch (error) {
        console.error('Errore nel recupero delle giacenze:', error);
      }
    };

    fetchGiacenze();
  }, [articolo, authToken]);

  return (
    <div className="giacenze-popup">
      <div className="popup-header">
        <h3 className="popup-header">Giacenze per {articolo.descrizione}</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <table className="table giacenze-table">
        <thead>
          <tr>
            <th>Taglia</th>
            <th>Colore</th>
            <th>Giacenza</th>
          </tr>
        </thead>
        <tbody>
          {giacenze.map((giacenza, index) => (
            <tr key={index}>
              <td>{giacenza.taglia}</td>
              <td>{giacenza.colore}</td>
              <td>{giacenza.giacenza}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GiacenzeArticolo;
