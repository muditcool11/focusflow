import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Auto-logout on unauthorized
      localStorage.removeItem('token');
      // Soft redirect if running inside SPA
      if (typeof window !== 'undefined') {
        const isOnLogin = window.location.pathname === '/login';
        if (!isOnLogin) window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

