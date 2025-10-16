import { authClient } from './apiClient';

export async function login(username, password) {
  // authClient baseURL already includes /api/auth
  const response = await authClient.post('/login', { username, password });
  return response.data;
}

export async function register(username, email, password) {
  const response = await authClient.post('/register', { username, email, password });
  return response.data;
}

