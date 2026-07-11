import { request } from './client';
import * as db from './db';
import { storage } from '../utils/storage';
import { comCache, invalidateCached } from '../utils/cache';

const TTL_FAVORITOS_MS = 30 * 60 * 1000;
const TTL_CALENDARIO_MS = 30 * 60 * 1000;

function currentUserId() {
  return storage.getToken();
}

export async function listAreas() {
  return request('/areas');
}

export async function listOlimpiadas({ areaId } = {}) {
  return request(`/olimpiadas${areaId ? `?area_id=${areaId}` : ''}`);
}

export async function getOlimpiada(id) {
  return request(`/olimpiadas/${id}`);
}

export async function listFavoritos() {
  return comCache('favoritos', TTL_FAVORITOS_MS, () => request('/usuarios/me/favoritos'));
}

export async function toggleFavorito(olimpiadaId) {
  const data = await request(`/olimpiadas/${olimpiadaId}/favorito`, { method: 'POST' });
  invalidateCached('favoritos');
  invalidateCached('calendario');
  return data;
}

export async function getEdicao(edicaoId) {
  return request(`/edicoes/${edicaoId}`);
}

export async function listCalendarEvents() {
  return comCache('calendario', TTL_CALENDARIO_MS, () => request('/usuarios/me/calendario'));
}

export async function listPosts(forumId) {
  return request(`/foruns/${forumId}/posts`);
}

export async function getPost(postId) {
  return request(`/posts/${postId}`);
}

export async function createPost(forumId, { titulo, conteudo }) {
  return request(`/foruns/${forumId}/posts`, { method: 'POST', body: { titulo, conteudo } });
}

export async function listComentarios(postId) {
  return request(`/posts/${postId}/comentarios`);
}

export async function createComentario(postId, conteudo) {
  return request(`/posts/${postId}/comentarios`, { method: 'POST', body: { conteudo } });
}
