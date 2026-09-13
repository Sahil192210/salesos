import axios from 'axios';

// On Vercel, if NEXT_PUBLIC_API_URL is not set, default to /api for same-origin serverless routing or http://localhost:5000/api in local dev
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    // If running in browser and no explicit API url is provided, use current origin /api or localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl()
});

// Dynamic baseURL updater in case window loads after initialization
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    if (!process.env.NEXT_PUBLIC_API_URL && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      config.baseURL = '/api';
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
