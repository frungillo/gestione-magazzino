
// ArticoloSelector.js
import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/base';

const ArticoloSelector = ({ articoloSelezionato, setArticoloSelezionato }) => {
  const [articoli, setArticoli] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/Articolo/getArticolo`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore nel caricamento degli articoli.');
        }
        return response.json();
      })
      .then((data) => setArticoli(data))
      .catch((error) => console.error('Errore nel caricamento degli articoli:', error));
  }, []);

  const articoliFiltrati = articoli.filter((articolo) =>
    articolo.descrizione.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="articolo-selector">
      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Cerca articolo..."
      />
      {articoliFiltrati.length === 0 ? (
        <p className="no-data">Nessun articolo trovato.</p>
      ) : (
        <ul className="articolo-list">
          {articoliFiltrati.map((articolo) => (
            <li
              key={articolo.id_articolo}
              className={articoloSelezionato === articolo.id_articolo ? 'selected' : ''}
              onClick={() => setArticoloSelezionato(articolo.id_articolo)}
            >
              {articolo.descrizione}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticoloSelector;
