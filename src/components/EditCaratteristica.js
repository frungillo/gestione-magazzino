import React, { useState, useEffect } from 'react';
import '../styles/EditCaratteristica.css';
import { insertCaratteristica, updateCaratteristica } from '../services/api';

const EditCaratteristica = ({ caratteristica, onClose, authToken }) => {
    const [taglia, setTaglia] = useState('');
    const [colore, setColore] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (caratteristica) {
            setTaglia(caratteristica.taglia || '');
            setColore(caratteristica.colore || '');
            setNote(caratteristica.note || '');
        }
    }, [caratteristica]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const caratteristicaData = {
            taglia,
            colore,
            note,
        };

        try {
            if (caratteristica) {
                // Modifica caratteristica esistente
                await updateCaratteristica(caratteristica.id, caratteristicaData, authToken);
            } else {
                // Aggiungi nuova caratteristica
                await insertCaratteristica(caratteristicaData, authToken);
            }

            onClose();
        } catch (error) {
            console.error('Errore durante il salvataggio della caratteristica:', error);
        }
    };

    return (
        <div className="edit-caratteristica-overlay">
            <div className="edit-caratteristica-popup">
                <h3>{caratteristica ? 'Modifica Caratteristica' : 'Aggiungi Caratteristica'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Taglia</label>
                        <input
                            type="text"
                            value={taglia}
                            onChange={(e) => setTaglia(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Colore</label>
                        <input
                            type="text"
                            value={colore}
                            onChange={(e) => setColore(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            Salva
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Annulla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCaratteristica;

