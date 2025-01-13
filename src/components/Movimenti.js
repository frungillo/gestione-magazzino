import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../services/base';
import ArticoloSelector from './ArticoloSelector';
import { Link } from 'react-router-dom';

const Movimentazione = () => {
  const [movimentazioni, setMovimentazioni] = useState([]);
  const [articoloSelezionato, setArticoloSelezionato] = useState('');
  const [caratteristiche, setCaratteristiche] = useState([]);
  const [caratteristicaSelezionata, setCaratteristicaSelezionata] = useState('');
  const [quantita, setQuantita] = useState(0);
  const [tipoMovimentazione, setTipoMovimentazione] = useState([]);
  const [tipoMovimentoSelezionato, setTipoMovimentoSelezionato] = useState('');
  const [note, setNote] = useState('');
  const [prezzo, setPrezzo] = useState(0);
  const [prezzoReale, setPrezzoReale] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [descrizioniArticoli, setDescrizioniArticoli] = useState({});
  const [descrizioniCaratteristiche, setDescrizioniCaratteristiche] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/Movimento/getMovimento`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore nel recupero delle movimentazioni.');
        }
        return response.json();
      })
      .then((data) => setMovimentazioni(data))
      .catch((error) => setErrorMessage(error.message));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/TipoMovimento/getTipoMovimento`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore nel recupero delle tipi movimento.');
        }
        return response.json();
      })
      .then((data) => setTipoMovimentazione(data))
      .catch((error) => setErrorMessage(error.message));
  }, []);

  useEffect(() => {
    if(!tipoMovimentoSelezionato && articoloSelezionato) {
      setErrorMessage("Selezionare il tipo di movimento");
      return;
    }
    if (articoloSelezionato) {
    var stringaFetch = `${API_URL}/Caratteristica/getCaratteristicaByIdArticolo/${articoloSelezionato}`;
      var obj = JSON.parse(tipoMovimentoSelezionato);
      if(obj.segno){
        stringaFetch = `${API_URL}/Caratteristica/getCaratteristica`; 
      }
      fetch(stringaFetch)
        .then((response) => {
          if (response.status === 404) {
            response.data = 
              [{
                id_caratteristica:0,
                taglia:"nessuna caratteristica",
                colore:"0"
              }];
            return response.data;
          }
          if (!response.ok) {
            throw new Error('Errore nel recupero delle caratteristiche.');
          }
          return response.json();
        })
        .then((data) => setCaratteristiche(data))
        .catch((error) => setErrorMessage(error.message));
    }
  }, [articoloSelezionato, tipoMovimentoSelezionato]);

  useEffect(() => {
    // Recuperiamo le descrizioni mancanti all'inizio (opzionale)
    const articoliMancanti = movimentazioni
      .map((mov) => mov.id_articolo)
      .filter((id) => !descrizioniArticoli[id]);

    articoliMancanti.forEach((id) => {
      decodeArticolo(id);
    });
  }, [movimentazioni]);

  useEffect(() => {
    // Recuperiamo le descrizioni mancanti all'inizio (opzionale)
    const caretteristicheMancanti = movimentazioni
      .map((mov) => mov.id_caratteristica)
      .filter((id) => !descrizioniCaratteristiche[id]);

      caretteristicheMancanti.forEach((id) => {
      decodeCaratteristica(id);
    });
  }, [movimentazioni]);

  const handleSubmit = (e) => {
    e.preventDefault();
    var obj="";
    try{
      obj = JSON.parse(tipoMovimentoSelezionato);
    } catch(error) {
      setErrorMessage("Tipo movimento non trovato");
      return;
    }
    const nuovaMovimentazione = {
      id_articolo: parseInt(articoloSelezionato),
      id_caratteristica: parseInt(caratteristicaSelezionata) || null,
      id_tipo: parseInt(obj.id_tipo_movimento),
      quantita: parseInt(quantita),
      data: new Date().toISOString(),
      prezzo: parseFloat(prezzo),
      prezzo_reale: parseFloat(prezzoReale),
      note,
    };

    fetch(`${API_URL}/Movimento/insertMovimento`, {
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
        setCaratteristicaSelezionata('');
        setQuantita(0);
        setNote('');
        setPrezzo(0);
        setPrezzoReale(0);
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const decodeArticolo = async (id_articolo) => {
    if (descrizioniArticoli[id_articolo]) {
      // Se la descrizione è già in stato, la restituiamo
      return descrizioniArticoli[id_articolo];
    }

    try {
      const response = await fetch(`${API_URL}/Articolo/getArticolo/${id_articolo}`);
      if (!response.ok) {
        throw new Error('Errore nel recupero articolo.');
      }
      const obj = await response.json();
      const descrizione = `${obj.descrizione} [${obj.id_articolo}]`;

      // Aggiorniamo lo stato con la nuova descrizione
      setDescrizioniArticoli((prev) => ({
        ...prev,
        [id_articolo]: descrizione,
      }));

      return descrizione;
    } catch (error) {
      setErrorMessage(error.message);
      return "";
    }
  };

  const decodeCaratteristica = async (id_caratteristica) => {
    if (descrizioniCaratteristiche[id_caratteristica]) {
      // Se la descrizione è già in stato, la restituiamo
      return descrizioniCaratteristiche[id_caratteristica];
    }

    try {
      const response = await fetch(`${API_URL}/Caratteristica/getCaratteristica/${id_caratteristica}`);
      if (!response.ok) {
        throw new Error('Errore nel recupero caratteristica.');
      }
      const obj = await response.json();
      const descrizione = `${obj.taglia}/${obj.colore}`;

      // Aggiorniamo lo stato con la nuova descrizione
      setDescrizioniCaratteristiche((prev) => ({
        ...prev,
        [id_caratteristica]: descrizione,
      }));

      return descrizione;
    } catch (error) {
      setErrorMessage(error.message);
      return "";
    }
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
      <Link to="/dashboard" className="btn btn-primary dashboard-button">
            Dashboard
          </Link>
      <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
          <label>Tipo di Movimentazione:</label>
          <select
            value={tipoMovimentoSelezionato}
            onChange={(e) => setTipoMovimentoSelezionato(e.target.value)}
            required
          >
            <option value="">Selezionare un operazione</option>
            {tipoMovimentazione.map((tipo) =>(
              <option key={tipo.id_tipo_movimento} value={JSON.stringify(tipo)}>{tipo.descrizione}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Articolo:</label>
          <ArticoloSelector
            articoloSelezionato={articoloSelezionato}
            setArticoloSelezionato={setArticoloSelezionato}
          />
        </div>
        {caratteristiche.length > 0 && (
          <div className="form-group">
            <label>Caratteristica:</label>
            <select
              value={caratteristicaSelezionata}
              onChange={(e) => setCaratteristicaSelezionata(e.target.value)}
              required
            >
              <option value="">Seleziona una caratteristica</option>
              {caratteristiche.map((caratteristica) => (
                <option key={caratteristica.id_caratteristica} value={caratteristica.id_caratteristica}>
                  {caratteristica.taglia}-{caratteristica.colore}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Quantita:</label>
          <input
            type="number"
            value={quantita}
            onChange={(e) => setQuantita(Number(e.target.value))}
            required
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label>Prezzo:</label>
          <input
            type="number"
            value={prezzo}
            onChange={(e) => setPrezzo(Number(e.target.value))}
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Prezzo Reale:</label>
          <input
            type="number"
            value={prezzoReale}
            onChange={(e) => setPrezzoReale(Number(e.target.value))}
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Conferma Movimentazione</button>
      </form>

      <h3>Movimentazioni Recenti</h3>
      {movimentazioni.length === 0 ? (
        <p className="table">Non ci sono movimentazioni recenti.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Articolo</th>
              <th>Taglia/Colore</th>
              <th>Quantita</th>
              <th>Tipo</th>
              <th>Prezzo</th>
              <th>Prezzo Reale</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {movimentazioni.map((mov) => (
              <tr key={mov.id_movimento}>
                <td>{new Date(mov.data).toLocaleDateString()}</td>
                <td>{descrizioniArticoli[mov.id_articolo] || "Caricamento..."}</td>
                <td>{descrizioniCaratteristiche[mov.id_caratteristica] || "Caricamento..."}</td>
                <td>{mov.quantita}</td>
                <td>{mov.id_tipo === 1 ? 'Carico' : 'Scarico'}</td>
                <td>{mov.prezzo}</td>
                <td>{mov.prezzo_reale}</td>
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
