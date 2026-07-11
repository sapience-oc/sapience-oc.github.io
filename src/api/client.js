import { storage } from '../utils/storage';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.sapience.example.com';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const token = storage.getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(data?.message || 'Erro na requisicao', res.status, data);
  }

  return data;

}

export { ApiError };