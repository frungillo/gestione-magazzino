import React, { useState, useEffect } from 'react';
import '../styles/TipoMovimento.css';
import { Link } from 'react-router-dom';
import { getTipoMovimento } from '../services/api'; // Usa il servizio importato
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faArrowRightFromBracket,faArrowsTurnToDots } from '@fortawesome/free-solid-svg-icons';



const TipoMovimento = () => {
    const [tipiMovimento, setTipiMovimento] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTipiMovimento = async () => {
            try {
                const data = await getTipoMovimento(); // Chiama il servizio importato
                setTipiMovimento(data);
            } catch (err) {
                setError('Errore durante il recupero dei tipi di movimento.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTipiMovimento();
    }, []);

    if (isLoading) {
        return <div className="loading">Caricamento tipi di movimento...</div>;
    }

    if (error) {
        return <div className="error">Errore: {error}</div>;
    }

    return (
        <div className="tipo-movimento-container">
            <div className="header-row">
                <h2><FontAwesomeIcon icon={faArrowsTurnToDots}/><span>  </span>Tipi di Movimento</h2>
                <Link to="/dashboard" className="btn btn-primary dashboard-button">
                    Dashboard
                </Link>
            </div>
            <table className="tipo-movimento-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descrizione</th>
                        <th>Movimento</th>
                        <th>IN / OUT</th>
                    </tr>
                </thead>
                <tbody>
                    {tipiMovimento.map((movimento) => (
                        <tr key={movimento.id_tipo_movimento}>
                            <td>{movimento.id_tipo_movimento}</td>
                            <td>{movimento.descrizione}</td>
                            <td>{movimento.segno ? 'Positivo' : 'Negativo'}</td>
                            <td>
                                {movimento.segno ? (
                                    <FontAwesomeIcon icon={faArrowRightToBracket} className="icon-positive" />
                                ) : (
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-negative" />
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TipoMovimento;

