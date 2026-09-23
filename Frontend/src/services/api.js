// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000', // Ajusta el puerto si usas otro (ej. 3000, 5000)
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
