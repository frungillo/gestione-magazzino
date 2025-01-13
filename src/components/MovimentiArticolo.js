import React, { useState, useEffect } from "react";
import "../styles//MovimentiArticolo.css"; // Stile del popup
import { getMovimentiArticolo } from "../services/api";


const MovimentiArticolo = ({ articolo, authToken, onClose }) => {
    const [movimenti, setMovimenti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("id_articolo", articolo.id_articolo);
        const fetchMovimenti = async () => {
            try {
                const data = await getMovimentiArticolo(articolo.id_articolo, authToken);
                setMovimenti(data);
            } catch (err) {
                console.error('Errore nel recupero delle giacenze:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovimenti();
    }, [articolo, authToken]);


    return (
        <div className="movimenti-popup">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h3>Movimenti per Articolo: {articolo.descrizione}</h3>
                {loading && <p>Caricamento in corso...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && (
                    <table className="movimenti-table">
                        <thead>
                            <tr>
                                <th>Movimento</th>
                                <th>Articolo</th>
                                <th>Taglia</th>
                                <th>Colore</th>
                                <th>Quantità</th>
                                <th>Data</th>
                                <th>Prezzo - €</th>
                                <th>Prezzo Reale - €</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimenti.map((movimento, index) => (
                                <tr key={index}>
                                    <td>{movimento.movimento}</td>
                                    <td>{movimento.articolo}</td>
                                    <td>{movimento.taglia}</td>
                                    <td>{movimento.colore}</td>
                                    <td>{movimento.quantità}</td>
                                    <td>{new Date(movimento.data).toLocaleDateString()}</td>
                                    <td>{movimento.prezzo.toFixed(2)}</td>
                                    <td>{movimento.prezzoReale.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MovimentiArticolo;
