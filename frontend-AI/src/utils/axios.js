import axios from 'axios';

// Use relative URL /api/v1 to route requests through Vite's dev server proxy
// This completely avoids browser CORS preflight errors without modifying any backend code.
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
