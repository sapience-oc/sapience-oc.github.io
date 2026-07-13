import { storage } from '../utils/storage';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.sapience.example.com';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const MAX_TENTATIVAS = 4;
const BACKOFF_BASE_MS = 400;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function valeTentarDeNovo(err) {
  if (err instanceof ApiError) {
    return err.status >= 500;
  }
  return true;
}

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const token = storage.getToken();

  let ultimoErro;
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
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
    } catch (err) {
      ultimoErro = err;

      const ehUltimaTentativa = tentativa === MAX_TENTATIVAS;
      if (ehUltimaTentativa || !valeTentarDeNovo(err)) {
        throw err;
      }

      console.warn(
        `[api] ${method} ${path} falhou (tentativa ${tentativa}/${MAX_TENTATIVAS}), tentando de novo...`,
        err
      );
      await esperar(BACKOFF_BASE_MS * tentativa);
    }
  }

  throw ultimoErro;
}

export { ApiError };