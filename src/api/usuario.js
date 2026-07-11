import { USE_MOCK, request, mockDelay } from './client';
import * as store from './mockData';
import * as db from './db';
import { storage } from '../utils/storage';
import { comCache, setCached } from '../utils/cache';

const TTL_PERFIL_MS = 5 * 60 * 1000; // 5 minutos

function currentUserId() {
  // Consistente com auth.getCurrentUser(): a fonte da verdade de "quem esta
  // logado" e o token, nao o cache do objeto usuario (que pode nao existir
  // ainda em alguns fluxos, mesmo com uma sessao valida).
  return storage.getToken() ? store.MOCK_USER_ID : null;
}

function getMockUser() {
  return store.usuarios.find((u) => u.id === currentUserId());
}

// -------------------------------------------------------------------------
export async function getPerfil() {
  if (USE_MOCK) {
    const user = getMockUser();
    return mockDelay(db.serializeUsuario(user));
  }
  return comCache('perfil', TTL_PERFIL_MS, () => request('/usuarios/me'));
}

export async function updatePerfil(payload) {
  if (USE_MOCK) {
    const user = getMockUser();
    if (!user) throw new Error('Usuario nao autenticado.');
    Object.assign(user, payload);
    const serialized = db.serializeUsuario(user);
    storage.setUser(serialized);
    return mockDelay(serialized);
  }
  const data = await request('/usuarios/me', { method: 'PATCH', body: payload });
  storage.setUser(data);
  setCached('perfil', data); // ja temos o dado fresco, atualiza o cache direto (sem invalidar+refetch)
  return data;
}

// -------------------------------------------------------------------------
// Series escolares (usadas no formulario de cadastro/edicao de perfil)
// -------------------------------------------------------------------------
export async function listSeriesEscolares() {
  if (USE_MOCK) return mockDelay(store.seriesEscolares);
  return request('/series-escolares');
}

// -------------------------------------------------------------------------
// Acompanhamentos (inscrito / premiacao / observacoes por edicao)
// -------------------------------------------------------------------------
export async function listAcompanhamentos() {
  if (USE_MOCK) {
    const uid = currentUserId();
    const lista = store.acompanhamentos.filter((a) => a.usuarioId === uid);
    return mockDelay(lista.map(db.serializeAcompanhamento));
  }
  return request('/usuarios/me/acompanhamentos');
}

export async function listPremiacoes() {
  if (USE_MOCK) {
    const uid = currentUserId();
    const lista = store.acompanhamentos.filter((a) => a.usuarioId === uid && a.premiacao);
    return mockDelay(lista.map(db.serializeAcompanhamento));
  }
  return request('/usuarios/me/acompanhamentos?somente_premiados=true');
}

// Cria ou atualiza (upsert) o acompanhamento do usuario para uma edicao.
export async function salvarAcompanhamento({ edicaoId, premiacao, inscrito, observacoes }) {
  if (USE_MOCK) {
    const uid = currentUserId();
    if (!uid) throw new Error('Usuario nao autenticado.');
    if (!edicaoId) throw new Error('Selecione uma edicao valida.');

    let existente = store.acompanhamentos.find((a) => a.usuarioId === uid && a.edicaoId === edicaoId);
    if (existente) {
      if (premiacao !== undefined) existente.premiacao = premiacao;
      if (inscrito !== undefined) existente.inscrito = inscrito;
      if (observacoes !== undefined) existente.observacoes = observacoes;
    } else {
      existente = {
        id: store.generateId('ac'),
        usuarioId: uid,
        edicaoId,
        inscrito: inscrito ?? true,
        premiacao: premiacao ?? null,
        observacoes: observacoes ?? null,
      };
      store.acompanhamentos.push(existente);
    }
    return mockDelay(db.serializeAcompanhamento(existente));
  }
  return request('/acompanhamentos', { method: 'POST', body: { edicaoId, premiacao, inscrito, observacoes } });
}

export async function removerPremiacao(acompanhamentoId) {
  if (USE_MOCK) {
    const item = store.acompanhamentos.find((a) => a.id === acompanhamentoId);
    if (item) item.premiacao = null;
    return mockDelay({ ok: true });
  }
  return request(`/acompanhamentos/${acompanhamentoId}`, { method: 'PATCH', body: { premiacao: null } });
}