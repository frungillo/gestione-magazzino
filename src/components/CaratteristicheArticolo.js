import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import { AuthContext } from '../contexts/AuthContext';
import { getCaratteristiche, deleteCaratteristica } from '../services/api';
import EditCaratteristica from './EditCaratteristica';
import { Link } from 'react-router-dom';
import '../styles/CaratteristicheArticolo.css';

const CaratteristicheArticolo = () => {
    const { authToken } = useContext(AuthContext);
    const [caratteristiche, setCaratteristiche] = useState([]);
    const [selectedCaratteristica, setSelectedCaratteristica] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);

    // Funzione per recuperare le caratteristiche
    const fetchCaratteristiche = async () => {
        try {
            const data = await getCaratteristiche(authToken);
            setCaratteristiche(data);
        } catch (error) {
            console.error('Errore nel recupero delle caratteristiche:', error);
        }
    };

    useEffect(() => {
        fetchCaratteristiche();
    }, [authToken]);

    const handleAddCaratteristica = () => {
        setSelectedCaratteristica(null); // Aggiunta di una nuova caratteristica
        setShowEditPopup(true);
    };

    const handleEditCaratteristica = (caratteristica) => {
        setSelectedCaratteristica(caratteristica); // Modifica caratteristica esistente
        setShowEditPopup(true);
    };

    const handleDeleteCaratteristica = async (id) => {
        const conferma = window.confirm('Sei sicuro di voler eliminare questa caratteristica?');
        if (conferma) {
            try {
                await deleteCaratteristica(id, authToken);
                alert('Caratteristica eliminata con successo.');
                fetchCaratteristiche();
            } catch (error) {
                console.error("Errore durante l'eliminazione della caratteristica:", error);
                alert('Errore durante l\'eliminazione. Riprova più tardi.');
            }
        }
    };

    const handlePopupClose = () => {
        setShowEditPopup(false);
        fetchCaratteristiche();
    };

    return (
        <div className="container">
            <h2>Gestione Caratteristiche Articoli</h2>
            <div className="header-buttons">
                <button
                    className="btn btn-success add-characteristic-button"
                    onClick={handleAddCaratteristica}
                >
                    Aggiungi Caratteristica
                </button>
                <Link to="/dashboard" className="btn btn-primary dashboard-button">
                    Dashboard
                </Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Taglia</th>
                        <th>Colore</th>
                        <th>Note</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {caratteristiche.map((caratteristica) => (
                        <tr key={caratteristica.id_caratteristica}>
                            <td>{caratteristica.id_caratteristica}</td>
                            <td>{caratteristica.taglia}</td>
                            <td>{caratteristica.colore}</td>
                            <td>{caratteristica.note || 'Nessuna nota'}</td>
                            <td>
                                <button
                                    className="btn btn-icon"
                                    onClick={() => handleEditCaratteristica(caratteristica)}
                                    data-tooltip-id={`tooltip-edit-${caratteristica.id_caratteristica}`}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <Tooltip
                                    id={`tooltip-edit-${caratteristica.id_caratteristica}`}
                                    content="Modifica"
                                    place="top"
                                />
                                <button
                                    className="btn btn-icon"
                                    onClick={() => handleDeleteCaratteristica(caratteristica.id_caratteristica)}
                                    data-tooltip-id={`tooltip-delete-${caratteristica.id_caratteristica}`}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <Tooltip
                                    id={`tooltip-delete-${caratteristica.id_caratteristica}`}
                                    content="Elimina"
                                    place="top"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showEditPopup && (
                <EditCaratteristica
                    caratteristica={selectedCaratteristica}
                    onClose={handlePopupClose}
                    authToken={authToken}
                />
            )}
        </div>
    );
};

export default CaratteristicheArticolo;



