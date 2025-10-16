import apiClient from './apiClient';

export async function fetchTasks(params = {}) {
  const response = await apiClient.get('/tasks', { params });
  return response.data;
}

export async function createTask(task) {
  const response = await apiClient.post('/tasks', task);
  return response.data;
}

export async function updateTask(id, task) {
  const response = await apiClient.put(`/tasks/${id}`, task);
  return response.data;
}

export async function deleteTask(id) {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
}

