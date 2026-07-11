import { request } from './client';
import * as db from './db';
import { storage } from '../utils/storage';
import { clearAllCached } from '../utils/cache';

export async function login({ identifier, password }) {
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

export async function register(payload) {
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

export async function forgotPassword({ email }) {
  return request('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email },
  });
}

export async function getCurrentUser() {
  const token = storage.getToken();
  if (!token) return null;

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