import axios from 'axios';

// Create two axios instances: one for auth/user-service and one for task-service.
// Auth/user-service runs on port 8081 and exposes endpoints under /api/auth.
// Task-service runs on port 8082 and exposes endpoints under /api/tasks.

const authBaseUrl = process.env.REACT_APP_AUTH_BASE_URL || 'http://localhost:8081/api/auth';
const taskBaseUrl = process.env.REACT_APP_TASK_BASE_URL || 'http://localhost:8082/api/tasks';

export const authClient = axios.create({
  baseURL: authBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

export const taskClient = axios.create({
  baseURL: taskBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

// Shared request interceptor to attach token when present.
const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

authClient.interceptors.request.use(attachToken);
taskClient.interceptors.request.use(attachToken);

const handleUnauth = (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      const isOnLogin = window.location.pathname === '/login';
      if (!isOnLogin) window.location.assign('/login');
    }
  }
  return Promise.reject(error);
};

authClient.interceptors.response.use((res) => res, handleUnauth);
taskClient.interceptors.response.use((res) => res, handleUnauth);

export default { authClient, taskClient };

