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

