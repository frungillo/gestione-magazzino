import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/base';

const ArticoloSelector = ({ articoloSelezionato, setArticoloSelezionato }) => {
  const [articoli, setArticoli] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mostraElenco, setMostraElenco] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/Articolo/getArticolo`)
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
    <div className="articoli-selector">
      <input
        type="text"
        value={filtro}
        onChange={(e) => {
          setFiltro(e.target.value);
          setMostraElenco(e.target.value.length > 0);
        }}
        placeholder="Cerca articolo..."
      />
      {mostraElenco && articoliFiltrati.length > 0 && (
        <ul className="articoli-list">
          {articoliFiltrati.map((articolo) => (
            <li
              key={articolo.id_articolo}
              className={articoloSelezionato === articolo.id_articolo ? 'selected' : ''}
              onClick={() => {
                setArticoloSelezionato(articolo.id_articolo);
                setMostraElenco(false);
                setFiltro(articolo.descrizione);
              }}
            >
              {articolo.descrizione}
            </li>
          ))}
        </ul>
      )}
      {mostraElenco && articoliFiltrati.length === 0 && (
        <p className="no-data">Nessun articolo trovato.</p>
      )}
    </div>
  );
};

export default ArticoloSelector;
