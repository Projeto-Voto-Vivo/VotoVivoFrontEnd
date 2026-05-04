import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 10000,
});

export default api;
