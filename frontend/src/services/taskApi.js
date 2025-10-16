import { taskClient } from './apiClient';

export async function fetchTasks(params = {}) {
  // taskClient baseURL already includes /api/tasks
  // If a status filter is provided, call the dedicated endpoint in the controller: GET /status/{status}
  try {
    // Use query params for server-side filtering (status and priority supported)
    const queryParams = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.priority) queryParams.priority = params.priority;

    const response = await taskClient.get('/', { params: queryParams });
    return response.data;
  } catch (err) {
    // If the server returns 404, treat it as "no tasks" and return an empty list so UI shows "No tasks found".
    if (err?.response?.status === 404) return [];
    // Re-throw other errors so caller can handle them (401/500 etc.)
    throw err;
  }
}

export async function createTask(task) {
  const response = await taskClient.post('/', task);
  return response.data;
}

export async function updateTask(id, task) {
  const response = await taskClient.put(`/${id}`, task);
  return response.data;
}

export async function deleteTask(id) {
  const response = await taskClient.delete(`/${id}`);
  return response.data;
}

