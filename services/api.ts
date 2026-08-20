import axios from 'axios';

const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? (process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_API_URL || '/api/proxy');

	const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    ...(isServer && { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    })
  },
  timeout: 10000, 
});

export default api;
