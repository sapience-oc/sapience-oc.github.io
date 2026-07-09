import { USE_MOCK, request, mockDelay } from './client';
import * as store from './mockData';
import * as db from './db';
import { storage } from '../utils/storage';

function currentUserId() {
  // Consistente com auth.getCurrentUser(): a fonte da verdade de "quem esta
  // logado" e o token, nao o cache do objeto usuario (que pode nao existir
  // ainda em alguns fluxos, mesmo com uma sessao valida).
  return storage.getToken() ? store.MOCK_USER_ID : null;
}

// -------------------------------------------------------------------------
export async function listAreas() {
  if (USE_MOCK) return mockDelay(store.areas);
  // return request('/areas');
}

export async function listOlimpiadas({ areaId } = {}) {
  if (USE_MOCK) {
    const uid = currentUserId();
    let lista = store.olimpiadas;
    if (areaId) lista = lista.filter((o) => o.areaIds.includes(areaId));
    return mockDelay(lista.map((o) => db.serializeOlimpiadaResumo(o, uid)));
  }
  // return request(`/olimpiadas${areaId ? `?area_id=${areaId}` : ''}`);
}

export async function getOlimpiada(id) {
  if (USE_MOCK) {
    const uid = currentUserId();
    const found = db.findOlimpiada(id);
    return mockDelay(found ? db.serializeOlimpiadaCompleta(found, uid) : null);
  }
  // return request(`/olimpiadas/${id}`);
}

export async function listFavoritos() {
  if (USE_MOCK) {
    const uid = currentUserId();
    const user = store.usuarios.find((u) => u.id === uid);
    const ids = user?.favoritoOlimpiadaIds || [];
    const lista = store.olimpiadas.filter((o) => ids.includes(o.id));
    return mockDelay(lista.map((o) => db.serializeOlimpiadaResumo(o, uid)));
  }
  // return request('/usuarios/me/favoritos');
}

export async function toggleFavorito(olimpiadaId) {
  if (USE_MOCK) {
    const uid = currentUserId();
    const user = store.usuarios.find((u) => u.id === uid);
    if (!user) throw new Error('Usuario nao autenticado.');
    const jaTem = user.favoritoOlimpiadaIds.includes(olimpiadaId);
    user.favoritoOlimpiadaIds = jaTem
      ? user.favoritoOlimpiadaIds.filter((id) => id !== olimpiadaId)
      : [...user.favoritoOlimpiadaIds, olimpiadaId];
    const olimpiada = db.findOlimpiada(olimpiadaId);
    return mockDelay(db.serializeOlimpiadaResumo(olimpiada, uid));
  }
  // return request(`/olimpiadas/${olimpiadaId}/favorito`, { method: 'POST' });
}

// -------------------------------------------------------------------------
// Edicoes
// -------------------------------------------------------------------------
export async function getEdicao(edicaoId) {
  if (USE_MOCK) {
    const uid = currentUserId();
    const edicao = db.findEdicao(edicaoId);
    return mockDelay(db.serializeEdicaoCompleta(edicao, uid));
  }
  // return request(`/edicoes/${edicaoId}`);
}

// -------------------------------------------------------------------------
// Calendario: mostra apenas os prazos das edicoes atuais das olimpiadas
// que o usuario favoritou (nao entra nada so por causa de acompanhamento).
// -------------------------------------------------------------------------
export async function listCalendarEvents() {
  if (USE_MOCK) {
    const uid = currentUserId();
    const user = store.usuarios.find((u) => u.id === uid);
    const favoritoIds = user?.favoritoOlimpiadaIds || [];

    const edicoesRelevantes = store.edicoes.filter((e) => favoritoIds.includes(e.olimpiadaId));
    const edicaoIds = new Set(edicoesRelevantes.map((e) => e.id));

    const eventos = store.prazos
      .filter((p) => edicaoIds.has(p.edicaoId))
      .map((p) => {
        const edicao = db.findEdicao(p.edicaoId);
        const olimpiada = db.findOlimpiada(edicao.olimpiadaId);
        return {
          id: p.id,
          data: p.data,
          nome: p.nome,
          tipoPrazo: db.findTipoPrazo(p.tipoPrazoId),
          titulo: `${olimpiada.sigla} - ${olimpiada.nome}`,
          nota: p.nome,
          olimpiadaId: olimpiada.id,
          olimpiadaSigla: olimpiada.sigla,
          olimpiadaNome: olimpiada.nome,
          edicaoId: edicao.id,
          edicaoAno: edicao.ano,
        };
      });

    return mockDelay(eventos);
  }
  // return request('/usuarios/me/calendario'); // ja filtrado pelos favoritos no backend
}

// -------------------------------------------------------------------------
// Forum / Posts / Comentarios
// -------------------------------------------------------------------------
export async function listPosts(forumId) {
  if (USE_MOCK) {
    const lista = store.posts.filter((p) => p.forumId === forumId);
    return mockDelay(lista.map(db.serializePost));
  }
  // return request(`/foruns/${forumId}/posts`);
}

export async function getPost(postId) {
  if (USE_MOCK) {
    const post = store.posts.find((p) => p.id === postId);
    if (!post) return mockDelay(null);
    const forum = store.foruns.find((f) => f.id === post.forumId);
    const edicao = forum ? db.findEdicao(forum.edicaoId) : null;
    const olimpiada = edicao ? db.findOlimpiada(edicao.olimpiadaId) : null;
    return mockDelay({
      ...db.serializePost(post),
      forum: forum ? { id: forum.id, titulo: forum.titulo } : null,
      olimpiada: olimpiada ? { id: olimpiada.id, sigla: olimpiada.sigla, nome: olimpiada.nome } : null,
    });
  }
  // return request(`/posts/${postId}`);
}

export async function createPost(forumId, { titulo, conteudo }) {
  if (USE_MOCK) {
    const uid = currentUserId();
    const novo = {
      id: store.generateId('post'),
      forumId,
      titulo,
      conteudo,
      curtidas: 0,
      autorId: uid,
    };
    store.posts.push(novo);
    return mockDelay(db.serializePost(novo));
  }
  // return request(`/foruns/${forumId}/posts`, { method: 'POST', body: { titulo, conteudo } });
}

export async function listComentarios(postId) {
  if (USE_MOCK) {
    const lista = store.comentarios.filter((c) => c.postId === postId);
    return mockDelay(lista.map(db.serializeComentario));
  }
  // return request(`/posts/${postId}/comentarios`);
}

export async function createComentario(postId, conteudo) {
  if (USE_MOCK) {
    const uid = currentUserId();
    const novo = {
      id: store.generateId('com'),
      postId,
      conteudo,
      curtidas: 0,
      autorId: uid,
    };
    store.comentarios.push(novo);
    return mockDelay(db.serializeComentario(novo));
  }
  // return request(`/posts/${postId}/comentarios`, { method: 'POST', body: { conteudo } });
}
