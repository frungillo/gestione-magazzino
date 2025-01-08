import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getArticoli, getGiacenza } from '../services/api';
import '../styles/Articoli.css';

const Articoli = () => {
  const [articoli, setArticoli] = useState([]);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticoli = async () => {
      try {
        const data = await getArticoli(authToken);
        // Aggiungi una proprietà "giacenza" per ogni articolo
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

  return (
    <div className="container">
      <div className="header">
        <h2>Gestione Articoli</h2>
        <Link to="/dashboard" className="btn btn-primary dashboard-button">
          Dashboard
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrizione</th>
            <th>Note</th>
            <th>Giacenza</th>
          </tr>
        </thead>
        <tbody>
          {articoli.map((articolo) => (
            <tr key={articolo.id_articolo}>
              <td>{articolo.id_articolo}</td>
              <td>{articolo.descrizione}</td>
              <td>{articolo.note}</td>
              <td>{articolo.giacenza !== undefined ? articolo.giacenza : 'Caricamento...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Articoli;


