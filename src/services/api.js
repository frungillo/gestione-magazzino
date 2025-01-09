import axios from 'axios';

import { API_URL } from './base';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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
    console.log("id_articolo", id_articolo);
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
  try {
    const response = await apiClient.post(`/Articolo/insertArticolo`, nuovoArticolo, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'Articolo:', error);
    throw error;
  }
};

export const updateArticolo = async (updatedArticolo, token) => {

  try {
    const response = await apiClient.post(`/Articolo/modificaArticolo`, updatedArticolo, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'articolo:', error);
    throw error;
  }
};
