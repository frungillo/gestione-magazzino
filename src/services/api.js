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


/*
export const hasExtra = async (tavoloIds) => {
  try {
      // Effettua una richiesta POST con gli ID
      const response = await axios.post(`${API_URL}/hasExtra`, tavoloIds, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      console.log("Risultati hasExtra:", response.data);
      return response.data; // Restituisce un array di booleani
  } catch (error) {
      console.error('Errore durante il recupero dei dati:', error);
      throw error;
  }
};
*/
