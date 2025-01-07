import axios from 'axios';

const API_URL = 'https://srvmicri.obbar.it/api';

export const getArticoli = async (token) => {
  const response = await axios.get(`${API_URL}/Articolo/getArticolo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Definisci funzioni simili per le altre operazioni e entità
