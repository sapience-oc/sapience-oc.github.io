import { storage } from '../utils/storage';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.sapience.example.com';

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';

export const MOCK_DELAY_MS = 280;

export function mockDelay(value, ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  throw new Error(
    'API real ainda nao configurada. Defina USE_MOCK=false e implemente request() em src/api/client.js'
  );

  /*
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
  */
}

export { ApiError };
