import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getArticoli } from '../services/api';

const Articoli = () => {
  const [articoli, setArticoli] = useState([]);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticoli = async () => {
      try {
        const data = await getArticoli(authToken);
        setArticoli(data);
      } catch (error) {
        console.error('Errore nel recupero degli articoli:', error);
      }
    };

    fetchArticoli();
  }, [authToken]);

  return (
    <div className="container">
      <h2>Gestione Articoli</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrizione</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {articoli.map((articolo) => (
            <tr key={articolo.id_articolo}>
              <td>{articolo.id_articolo}</td>
              <td>{articolo.descrizione}</td>
              <td>{articolo.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Articoli;
