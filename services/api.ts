import axios from 'axios';

const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? (process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_API_URL || '/api/proxy');

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 10000, 
});

export default api;
