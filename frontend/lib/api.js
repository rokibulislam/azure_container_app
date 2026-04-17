import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Request URL:', `${API_BASE_URL}${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  me: () => request('/api/auth/me'),
  getTasks: () => request('/api/tasks'),
  getTask: (id) => request(`/api/tasks/${id}`),
  createTask: (payload) =>
    request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateTask: (id, payload) =>
    request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  completeTask: (id) =>
    request(`/api/tasks/${id}/complete`, {
      method: 'POST'
    }),
  deleteTask: (id) =>
    request(`/api/tasks/${id}`, {
      method: 'DELETE'
    }),
  uploadAttachment: (taskId, formData) =>
    request(`/api/tasks/${taskId}/upload`, {
      method: 'POST',
      body: formData
    }),
  getAttachmentUrl: (id) => request(`/api/attachments/${id}`)
};