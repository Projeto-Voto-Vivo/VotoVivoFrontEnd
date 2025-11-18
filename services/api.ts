import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dadosabertos.camara.leg.br/api/v2', 
  headers: {
    'Accept': 'application/json'
  }
});

export default api;