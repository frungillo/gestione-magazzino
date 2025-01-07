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

// Definisci funzioni simili per le altre operazioni e entit�
