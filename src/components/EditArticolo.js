import React, { useState, useEffect } from 'react';
import '../styles/EditArticolo.css';
import { insertArticolo, updateArticolo } from '../services/api';

const EditArticolo = ({ articolo, onClose, authToken }) => {
    const [descrizione, setDescrizione] = useState('');
    const [note, setNote] = useState('');
    const [codice, setCodice] = useState(''); // Nuovo stato per il Codice Articolo


    useEffect(() => {
        if (articolo) {
            setDescrizione(articolo.descrizione);
            setNote(articolo.note);
            setCodice(articolo.codice || ''); // Inizializza con il valore esistente o vuoto
        }
    }, [articolo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const articoloData = {
            descrizione,
            note,
            codice, // Aggiungi il codice al payload
        };

        try {
            if (articolo) {
                // Modifica articolo esistente
                await fetch(`/api/articoli/${articolo.id_articolo}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(articoloData),
                });
            } else {
                // Aggiungi nuovo articolo
                await fetch(`/api/articoli`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(articoloData),
                });
            }

            onClose();
        } catch (error) {
            console.error('Errore durante il salvataggio dell\'articolo:', error);
        }
    };

    return (
        <div className="edit-articolo-overlay">
            <div className="edit-articolo-popup">
                <h3>{articolo ? 'Modifica Articolo' : 'Aggiungi Articolo'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Codice Articolo</label>
                        <input
                            type="text"
                            value={codice}
                            onChange={(e) => setCodice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descrizione</label>
                        <input
                            type="text"
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
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

export default EditArticolo;

