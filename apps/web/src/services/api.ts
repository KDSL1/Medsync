import axios from 'axios';

// Android Emulator host loopback is 10.0.2.2 instead of localhost
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Check if running inside Capacitor Android native webview
  const isCapacitor = typeof (window as any)?.Capacitor !== 'undefined';
  const isAndroid = isCapacitor && (window as any)?.Capacitor?.getPlatform() === 'android';
  if (isAndroid) {
    // 10.0.2.2 maps to the host machine's localhost from Android Emulator
    return 'http://10.0.2.2:8000/api';
  }
  return 'http://localhost:8000/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medsync_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and reload to login if unauthorized
      localStorage.removeItem('medsync_access_token');
      localStorage.removeItem('medsync_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
