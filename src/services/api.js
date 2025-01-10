import axios from 'axios';

import { API_URL } from './base';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const deleteArticolo = async (id_articolo, token) => {
  try {
    const response = await apiClient.delete(`/Articolo/deleteArticolo/${id_articolo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); return response.data;
  } catch (error) {
    console.error('Errore durante la cancellazione della Spesa:', error);
    throw error;
  }
};

export const getArticoli = async (token) => {
  const response = await apiClient.get(`/Articolo/getArticolo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;

};

export const getGiacenza = async (id_articolo, token) => {
  try {
    const response = await apiClient.get(`/Movimento/getGiacenza/${id_articolo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Errore durante il recupero della giacenza:", error);
    throw error;
  }
};

export const getDettaglioGiacenza = async (id_articolo, token) => {
  try {
    console.log("id_articolo", id_articolo);
    const response = await apiClient.get(`/Movimento/getDettaglioGiacenza/${id_articolo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Errore durante il recupero della giacenza:", error);
    throw error;
  }
};

export const insertArticolo = async (nuovoArticolo, token) => {
  if (!nuovoArticolo) {
    throw new Error("I dati del nuovo articolo non sono validi.");
  }

  try {
    const response = await apiClient.post('/Articolo/insertArticolo', nuovoArticolo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'articolo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Errore durante l\'inserimento dell\'articolo');
  }
};

export const updateArticolo = async (id_articolo, updatedArticolo, token) => {
  console.log("updatedArticolo", updatedArticolo);
  if (!updatedArticolo || !id_articolo) {
    throw new Error("I dati dell'articolo da aggiornare non sono validi o manca l'ID.");
  }

  try {
    const response = await apiClient.put(`/Articolo/modificaArticolo/${id_articolo}`, updatedArticolo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'articolo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Errore durante l\'aggiornamento dell\'articolo');
  }
};


