import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../services/base';
import '../styles/Articoli.css';
import ArticoloSelector from './ArticoloSelector';

const Movimentazione = () => {
  const [movimentazioni, setMovimentazioni] = useState([]);
  const [articoloSelezionato, setArticoloSelezionato] = useState('');
  const [quantita, setQuantita] = useState(0);
  const [tipoMovimentazione, setTipoMovimentazione] = useState('1'); // Tipo movimento (1 = carico, 2 = scarico)
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Recupera la lista delle movimentazioni
    fetch(`${API_URL}/api/Movimento/getMovimento`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore nel recupero delle movimentazioni.');
        }
        return response.json();
      })
      .then((data) => setMovimentazioni(data))
      .catch((error) => setErrorMessage(error.message));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuovaMovimentazione = {
      id_articolo: parseInt(articoloSelezionato),
      id_tipo: parseInt(tipoMovimentazione),
      quantita: parseInt(quantita),
      note,
    };

    // Invia la nuova movimentazione al server
    fetch(`${API_URL}/api/Movimento/insertMovimento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuovaMovimentazione),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Errore nella creazione della movimentazione');
          });
        }
        return response.json();
      })
      .then((data) => {
        setMovimentazioni([data, ...movimentazioni]);
        setArticoloSelezionato('');
        setQuantita(0);
        setNote('');
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <div className="container">
      {errorMessage && (
        <div className="error-modal">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')} className="close-modal">Chiudi</button>
        </div>
      )}
      <h2><FontAwesomeIcon icon={faExchangeAlt} /> Gestione Movimentazione Articoli</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Articolo:</label>
          <ArticoloSelector
            articoloSelezionato={articoloSelezionato}
            setArticoloSelezionato={setArticoloSelezionato}
          />
        </div>
        <div className="form-group">
          <label>Quantità:</label>
          <input
            type="number"
            value={quantita}
            onChange={(e) => setQuantita(Number(e.target.value))}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Tipo di Movimentazione:</label>
          <select
            value={tipoMovimentazione}
            onChange={(e) => setTipoMovimentazione(e.target.value)}
            required
          >
            <option value="1">Carico</option>
            <option value="2">Scarico</option>
          </select>
        </div>
        <div className="form-group">
          <label>Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Conferma Movimentazione</button>
      </form>

      <h3>Movimentazioni Recenti</h3>
      {movimentazioni.length === 0 ? (
        <p className="no-data">Non ci sono movimentazioni recenti.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Articolo</th>
              <th>Quantità</th>
              <th>Tipo</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {movimentazioni.map((mov) => (
              <tr key={mov.id_movimento}>
                <td>{new Date(mov.data).toLocaleString()}</td>
                <td>{mov.id_articolo}</td>
                <td>{mov.quantita}</td>
                <td>{mov.id_tipo === 1 ? 'Carico' : 'Scarico'}</td>
                <td>{mov.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Movimentazione;