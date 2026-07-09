import * as db from './mockData';


export function findArea(id) {
  return db.areas.find((a) => a.id === id) || null;
}
export function findNivel(id) {
  return db.niveis.find((n) => n.id === id) || null;
}
export function findTipoPrazo(id) {
  return db.tiposPrazo.find((t) => t.id === id) || null;
}
export function findSerieEscolar(id) {
  return db.seriesEscolares.find((s) => s.id === id) || null;
}
export function findUsuario(id) {
  return db.usuarios.find((u) => u.id === id) || null;
}
export function findOlimpiada(id) {
  return db.olimpiadas.find((o) => o.id === id) || null;
}
export function findEdicao(id) {
  return db.edicoes.find((e) => e.id === id) || null;
}

function iniciais(nome = '') {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '??';
}

export function serializeUsuario(usuario) {
  if (!usuario) return null;
  return {
    ...usuario,
    initials: iniciais(usuario.nome),
    serieEscolar: findSerieEscolar(usuario.serieEscolarId),
    areas: (usuario.areaIds || []).map(findArea).filter(Boolean),
  };
}

export function listarEdicoesResumo(olimpiadaId) {
  return db.edicoes
    .filter((e) => e.olimpiadaId === olimpiadaId)
    .sort((a, b) => b.ano - a.ano)
    .map((e) => ({ id: e.id, ano: e.ano, status: e.status }));
}

export function edicaoAtualDe(olimpiadaId) {
  const todas = db.edicoes
    .filter((e) => e.olimpiadaId === olimpiadaId)
    .sort((a, b) => b.ano - a.ano);
  if (todas.length === 0) return null;
  return (
    todas.find((e) => e.status === 'inscricoes_abertas') ||
    todas.find((e) => e.status === 'em_andamento') ||
    todas[0]
  );
}

function proximoPrazo(edicaoId) {
  const hoje = new Date();
  const doEdicao = db.prazos
    .filter((p) => p.edicaoId === edicaoId && p.data)
    .map((p) => ({ ...p, dataObj: new Date(p.data) }))
    .sort((a, b) => a.dataObj - b.dataObj);

  const futuro = doEdicao.find((p) => p.dataObj >= hoje);
  const escolhido = futuro || doEdicao[doEdicao.length - 1];
  if (!escolhido) return null;

  const diffMs = escolhido.dataObj - hoje;
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    ...escolhido,
    tipoPrazo: findTipoPrazo(escolhido.tipoPrazoId),
    diasRestantes,
  };
}


export function serializeOlimpiadaResumo(olimpiada, usuarioId) {
  const edicaoAtual = edicaoAtualDe(olimpiada.id);
  const prazo = edicaoAtual ? proximoPrazo(edicaoAtual.id) : null;
  const favoritado = usuarioId
    ? findUsuario(usuarioId)?.favoritoOlimpiadaIds?.includes(olimpiada.id)
    : false;

  return {
    id: olimpiada.id,
    nome: olimpiada.nome,
    sigla: olimpiada.sigla,
    corDestaque: olimpiada.corDestaque,
    imagemUrl: olimpiada.imagemUrl || null,
    areas: (olimpiada.areaIds || []).map(findArea).filter(Boolean),
    favoritado: !!favoritado,
    edicaoAtual: edicaoAtual
      ? {
          id: edicaoAtual.id,
          ano: edicaoAtual.ano,
          status: edicaoAtual.status,
        }
      : null,
    proximoPrazo: prazo
      ? { nome: prazo.nome, data: prazo.data, diasRestantes: prazo.diasRestantes, tipoPrazo: prazo.tipoPrazo }
      : null,
  };
}

export function serializeOlimpiadaCompleta(olimpiada, usuarioId) {
  const resumo = serializeOlimpiadaResumo(olimpiada, usuarioId);
  return {
    ...resumo,
    siteOficial: olimpiada.siteOficial,
    organizador: olimpiada.organizador,
    tiposInscricao: (olimpiada.tipoInscricaoIds || [])
      .map((id) => db.tiposInscricao.find((t) => t.id === id))
      .filter(Boolean),
    edicoes: listarEdicoesResumo(olimpiada.id),
  };
}

function getOrCriarForum(edicao, olimpiada) {
  let forum = db.foruns.find((f) => f.edicaoId === edicao.id);
  if (!forum) {
    forum = {
      id: db.generateId('forum'),
      edicaoId: edicao.id,
      titulo: `Duvidas e comentarios - ${olimpiada.sigla} ${edicao.ano}`,
      descricao: null,
    };
    db.foruns.push(forum);
  }
  return forum;
}

export function serializeEdicaoCompleta(edicao, usuarioId) {
  if (!edicao) return null;
  const olimpiada = findOlimpiada(edicao.olimpiadaId);
  const prazosDaEdicao = db.prazos
    .filter((p) => p.edicaoId === edicao.id)
    .map((p) => ({ ...p, tipoPrazo: findTipoPrazo(p.tipoPrazoId) }))
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  const forum = getOrCriarForum(edicao, olimpiada);
  const acompanhamento = usuarioId
    ? db.acompanhamentos.find((a) => a.usuarioId === usuarioId && a.edicaoId === edicao.id) || null
    : null;

  return {
    id: edicao.id,
    ano: edicao.ano,
    status: edicao.status,
    regulamento: edicao.regulamento,
    nivel: findNivel(edicao.nivelId),
    olimpiada: {
      id: olimpiada.id,
      nome: olimpiada.nome,
      sigla: olimpiada.sigla,
      organizador: olimpiada.organizador,
      siteOficial: olimpiada.siteOficial,
      corDestaque: olimpiada.corDestaque,
      imagemUrl: olimpiada.imagemUrl || null,
      areas: (olimpiada.areaIds || []).map(findArea).filter(Boolean),
      favoritado: findUsuario(usuarioId)?.favoritoOlimpiadaIds?.includes(olimpiada.id) || false,
    },
    prazos: prazosDaEdicao,
    forum: { id: forum.id, titulo: forum.titulo, descricao: forum.descricao },
    acompanhamento,
  };
}

export function serializePost(post) {
  const autor = findUsuario(post.autorId);
  const totalComentarios = db.comentarios.filter((c) => c.postId === post.id).length;
  return {
    ...post,
    autor: autor ? { id: autor.id, nome: autor.nome, initials: iniciais(autor.nome) } : null,
    totalComentarios,
  };
}

export function serializeComentario(comentario) {
  const autor = findUsuario(comentario.autorId);
  return {
    ...comentario,
    autor: autor ? { id: autor.id, nome: autor.nome, initials: iniciais(autor.nome) } : null,
  };
}

export function serializeAcompanhamento(acompanhamento) {
  const edicao = findEdicao(acompanhamento.edicaoId);
  const olimpiada = edicao ? findOlimpiada(edicao.olimpiadaId) : null;
  return {
    ...acompanhamento,
    edicao: edicao
      ? {
          id: edicao.id,
          ano: edicao.ano,
          status: edicao.status,
          olimpiada: olimpiada
            ? { id: olimpiada.id, nome: olimpiada.nome, sigla: olimpiada.sigla, corDestaque: olimpiada.corDestaque }
            : null,
        }
      : null,
  };
}