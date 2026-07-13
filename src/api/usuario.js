import { request } from './client';
import { storage } from '../utils/storage';
import { comCache, setCached } from '../utils/cache';

const TTL_PERFIL_MS = 30 * 60 * 1000;

function currentUserId() {
  return storage.getToken();
}

export async function getPerfil() {
  return comCache('perfil', TTL_PERFIL_MS, () => request('/usuarios/me'));
}

export async function updatePerfil(payload) {
  const data = await request('/usuarios/me', { method: 'PATCH', body: payload });
  storage.setUser(data);
  setCached('perfil', data);
  return data;
}

export async function listSeriesEscolares() {
  return comCache('series-escolares', 60 * 60 * 1000, () => request('/series-escolares'));
}

export async function listAcompanhamentos() {
  return request('/usuarios/me/acompanhamentos');
}

export async function listPremiacoes() {
  return request('/usuarios/me/acompanhamentos?somente_premiados=true');
}

export async function salvarAcompanhamento({ edicaoId, premiacao, inscrito, observacoes }) {
  return request('/acompanhamentos', { method: 'POST', body: { edicaoId, premiacao, inscrito, observacoes } });
}

export async function removerPremiacao(acompanhamentoId) {
  return request(`/acompanhamentos/${acompanhamentoId}`, { method: 'PATCH', body: { premiacao: null } });
}

export async function alterarSenha({ senhaAtual, novaSenha }) {
  return request('/usuarios/me/senha', {
    method: 'POST',
    body: { senhaAtual, novaSenha },
  });
}