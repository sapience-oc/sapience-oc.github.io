import { USE_MOCK, request, mockDelay } from './client';
import * as store from './mockData';
import * as db from './db';
import { storage } from '../utils/storage';
import { clearAllCached } from '../utils/cache';

function buildMockSession() {
  const usuario = store.usuarios.find((u) => u.id === store.MOCK_USER_ID);
  return db.serializeUsuario(usuario);
}

// -------------------------------------------------------------------------
// login(email, senha)
// -------------------------------------------------------------------------
export async function login({ identifier, password }) {
  if (USE_MOCK) {
    if (!identifier || !password) {
      throw new Error('Preencha usuario/e-mail e senha.');
    }
    const fakeToken = 'mock-token-' + Date.now();
    const user = buildMockSession();
    clearAllCached(); // evita misturar cache de uma sessao anterior com a nova
    storage.setToken(fakeToken);
    storage.setUser(user);
    return mockDelay({ token: fakeToken, user });
  }

  const data = await request('/auth/login', {
    method: 'POST',
    auth: false,
    body: { identifier, password },
  });
  clearAllCached();
  storage.setToken(data.token);
  storage.setUser(data.user);
  return data;
}

// -------------------------------------------------------------------------
// register(payload) - cadastro
// -------------------------------------------------------------------------
export async function register(payload) {
  if (USE_MOCK) {
    const fakeToken = 'mock-token-' + Date.now();
    const user = { ...buildMockSession(), ...payload };
    clearAllCached();
    storage.setToken(fakeToken);
    storage.setUser(user);
    return mockDelay({ token: fakeToken, user });
  }

  const data = await request('/auth/register', {
    method: 'POST',
    auth: false,
    body: payload,
  });
  clearAllCached();
  storage.setToken(data.token);
  storage.setUser(data.user);
  return data;
}

// -------------------------------------------------------------------------
// forgotPassword(email)
// -------------------------------------------------------------------------
export async function forgotPassword({ email }) {
  if (USE_MOCK) {
    if (!email) throw new Error('Informe um e-mail valido.');
    return mockDelay({ sent: true });
  }

  return request('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email },
  });
}

// -------------------------------------------------------------------------
// getCurrentUser() - usado no boot do app para restaurar sessao
// -------------------------------------------------------------------------
export async function getCurrentUser() {
  const token = storage.getToken();
  if (!token) return null;

  if (USE_MOCK) {
    const cached = storage.getUser();
    return cached || buildMockSession();
  }

  try {
    const user = await request('/auth/me');
    storage.setUser(user);
    return user;
  } catch (err) {
    storage.clearToken();
    storage.clearUser();
    clearAllCached();
    return null;
  }
}

export function logout() {
  storage.clearToken();
  storage.clearUser();
  clearAllCached();
}
