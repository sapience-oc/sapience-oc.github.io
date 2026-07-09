// -----------------------------------------------------------------------
// "Banco de dados" fake usado enquanto USE_MOCK = true.
//
// O formato segue de perto o diagrama de classes do backend real
// (Usuario, Olimpiada, EdicaoOlimpiada, Area, Nivel, TipoInscricao,
// TipoPrazo, Prazo, Colecao, AcompanhamentoColecao, Forum, Post,
// Comentario), inclusive nos nomes dos campos — assim, quando o FastAPI
// estiver pronto, o "encaixe" das respostas reais deve ser quase direto.
//
// As tabelas abaixo guardam so os IDs de relacionamento (como um banco
// relacional faria). Quem resolve os relacionamentos (JOINs) e o
// src/api/db.js, imitando o que os endpoints reais devem devolver.
// -----------------------------------------------------------------------

export let seriesEscolares = [
  { id: 'se1', nome: '1 ano - Ensino Medio' },
  { id: 'se2', nome: '2 ano - Ensino Medio' },
  { id: 'se3', nome: '3 ano - Ensino Medio' },
  { id: 'se4', nome: '9 ano - Ensino Fundamental' },
];

export let areas = [
  { id: 'ar1', nome: 'Matematica' },
  { id: 'ar2', nome: 'Fisica' },
  { id: 'ar3', nome: 'Robotica' },
  { id: 'ar4', nome: 'Biologia' },
  { id: 'ar5', nome: 'Astronomia' },
  { id: 'ar6', nome: 'Tecnologia' },
];

export let niveis = [
  { id: 'n1', nome: 'Ensino Fundamental' },
  { id: 'n2', nome: 'Ensino Medio' },
  { id: 'n3', nome: 'Livre' },
];

export let tiposInscricao = [
  { id: 'ti1', nome: 'Individual' },
  { id: 'ti2', nome: 'Equipe' },
];

export let tiposPrazo = [
  { id: 'tp1', nome: 'Inscricoes' },
  { id: 'tp2', nome: 'Fase 1' },
  { id: 'tp3', nome: 'Fase 2' },
  { id: 'tp4', nome: 'Resultado' },
  { id: 'tp5', nome: 'Desafio App' },
];

// StatusEdicao: 'em_breve' | 'inscricoes_abertas' | 'em_andamento' | 'encerrada'

export let olimpiadas = [
  {
    id: 'ol-obmep',
    nome: 'Olimpiada Brasileira de Matematica das Escolas Publicas',
    sigla: 'OBMEP',
    siteOficial: 'https://www.obmep.org.br',
    organizador: 'IMPA',
    corDestaque: '#5b6428',
    imagemUrl: null,
    areaIds: ['ar1'],
    tipoInscricaoIds: ['ti1'],
  },
  {
    id: 'ol-obt',
    nome: 'Olimpiada Brasileira de Tecnologia',
    sigla: 'OBT',
    siteOficial: 'https://obt.example.com',
    organizador: 'Alpha Lumen',
    corDestaque: '#274a2e',
    imagemUrl: 'https://placehold.co/160x160/274a2e/ffffff.png?text=OBT',
    areaIds: ['ar6'],
    tipoInscricaoIds: ['ti1', 'ti2'],
  },
  {
    id: 'ol-oba',
    nome: 'Olimpiada Brasileira de Astronomia e Astronautica',
    sigla: 'OBA',
    siteOficial: 'https://oba.org.br',
    organizador: 'AEB / SAB',
    corDestaque: '#2f3f66',
    imagemUrl: 'https://placehold.co/160x160/2f3f66/ffffff.png?text=OBA',
    areaIds: ['ar5'],
    tipoInscricaoIds: ['ti1'],
  },
  {
    id: 'ol-obb',
    nome: 'Olimpiada Brasileira de Biologia',
    sigla: 'OBB',
    siteOficial: 'https://obbio.org.br',
    organizador: 'SBG',
    corDestaque: '#8a2f3a',
    imagemUrl: null,
    areaIds: ['ar4'],
    tipoInscricaoIds: ['ti1'],
  },
  {
    id: 'ol-obr',
    nome: 'Olimpiada Brasileira de Robotica',
    sigla: 'OBR',
    siteOficial: 'https://www.obr.org.br',
    organizador: 'CBR',
    corDestaque: '#3d4a90',
    imagemUrl: null,
    areaIds: ['ar3'],
    tipoInscricaoIds: ['ti2'],
  },
  {
    id: 'ol-canguru',
    nome: 'Canguru de Matematica Sem Fronteiras',
    sigla: 'Canguru',
    siteOficial: 'https://canguru.org.br',
    organizador: 'IMPA',
    corDestaque: '#5b6428',
    imagemUrl: null,
    areaIds: ['ar1'],
    tipoInscricaoIds: ['ti1'],
  },
];

export let edicoes = [
  // OBT
  { id: 'ed-obt-2026', olimpiadaId: 'ol-obt', ano: 2026, nivelId: 'n2', status: 'inscricoes_abertas', regulamento: 'https://obt.example.com/regulamento-2026.pdf' },
  { id: 'ed-obt-2025', olimpiadaId: 'ol-obt', ano: 2025, nivelId: 'n2', status: 'encerrada', regulamento: 'https://obt.example.com/regulamento-2025.pdf' },
  // OBA
  { id: 'ed-oba-2026', olimpiadaId: 'ol-oba', ano: 2026, nivelId: 'n2', status: 'em_andamento', regulamento: 'https://oba.org.br/regulamento-2026.pdf' },
  // OBB
  { id: 'ed-obb-2026', olimpiadaId: 'ol-obb', ano: 2026, nivelId: 'n2', status: 'em_andamento', regulamento: 'https://obbio.org.br/regulamento-2026.pdf' },
  { id: 'ed-obb-2024', olimpiadaId: 'ol-obb', ano: 2024, nivelId: 'n2', status: 'encerrada', regulamento: 'https://obbio.org.br/regulamento-2024.pdf' },
  // OBR
  { id: 'ed-obr-2026', olimpiadaId: 'ol-obr', ano: 2026, nivelId: 'n2', status: 'em_andamento', regulamento: 'https://www.obr.org.br/regulamento-2026.pdf' },
  { id: 'ed-obr-2024', olimpiadaId: 'ol-obr', ano: 2024, nivelId: 'n2', status: 'encerrada', regulamento: 'https://www.obr.org.br/regulamento-2024.pdf' },
  // Canguru
  { id: 'ed-canguru-2026', olimpiadaId: 'ol-canguru', ano: 2026, nivelId: 'n2', status: 'inscricoes_abertas', regulamento: 'https://canguru.org.br/regulamento-2026.pdf' },
  // OBMEP
  { id: 'ed-obmep-2026', olimpiadaId: 'ol-obmep', ano: 2026, nivelId: 'n2', status: 'inscricoes_abertas', regulamento: 'https://www.obmep.org.br/regulamento-2026.pdf' },
];

export let prazos = [
  // OBT 2026
  { id: 'pz1', edicaoId: 'ed-obt-2026', nome: 'Inscricoes', data: '2026-03-30', tipoPrazoId: 'tp1' },
  { id: 'pz2', edicaoId: 'ed-obt-2026', nome: 'Desafio App', data: '2026-04-27', tipoPrazoId: 'tp5' },
  { id: 'pz3', edicaoId: 'ed-obt-2026', nome: 'Fase 1 - Nacional', data: '2026-06-14', tipoPrazoId: 'tp2' },
  // OBT 2025
  { id: 'pz4', edicaoId: 'ed-obt-2025', nome: 'Fase 1 - Nacional', data: '2025-06-10', tipoPrazoId: 'tp2' },
  { id: 'pz5', edicaoId: 'ed-obt-2025', nome: 'Resultado', data: '2025-09-01', tipoPrazoId: 'tp4' },
  // OBA 2026
  { id: 'pz6', edicaoId: 'ed-oba-2026', nome: 'Fase 1', data: '2026-06-01', tipoPrazoId: 'tp2' },
  // OBB 2026
  { id: 'pz7', edicaoId: 'ed-obb-2026', nome: 'Inscricoes', data: '2026-06-10', tipoPrazoId: 'tp1' },
  { id: 'pz8', edicaoId: 'ed-obb-2026', nome: 'Fase 2 - Nacional', data: '2026-06-25', tipoPrazoId: 'tp3' },
  // OBR 2026
  { id: 'pz9', edicaoId: 'ed-obr-2026', nome: 'Fase 2 - Nacional', data: '2026-06-09', tipoPrazoId: 'tp3' },
  // Canguru 2026
  { id: 'pz10', edicaoId: 'ed-canguru-2026', nome: 'Fase 1 - Internacional', data: '2026-06-22', tipoPrazoId: 'tp2' },
  // OBMEP 2026
  { id: 'pz11', edicaoId: 'ed-obmep-2026', nome: 'Inscricoes', data: '2026-06-18', tipoPrazoId: 'tp1' },
];

export let foruns = [
  { id: 'forum-obt-2026', edicaoId: 'ed-obt-2026', titulo: 'Duvidas e comentarios - OBT 2026', descricao: null },
  { id: 'forum-obr-2026', edicaoId: 'ed-obr-2026', titulo: 'Duvidas e comentarios - OBR 2026', descricao: null },
];

export let posts = [
  {
    id: 'post-1',
    forumId: 'forum-obt-2026',
    titulo: 'Onde fica o site da OBT?',
    conteudo: 'Nao estou achando o link oficial de inscricao, alguem pode compartilhar?',
    curtidas: 1,
    autorId: 'usr2',
  },
  {
    id: 'post-2',
    forumId: 'forum-obt-2026',
    titulo: 'Como deixar o FIGMA interativo?',
    conteudo:
      'Comecando a explorar melhor o Figma, quero renderizar meus prototipos mais interativos e dinamicos. Ao comecar a usar transicoes basicas, meus cliques nao davam certo e fluia mal entre os frames.',
    curtidas: 4,
    autorId: 'usr3',
  },
];

export let comentarios = [
  {
    id: 'com-1',
    postId: 'post-2',
    conteudo:
      'Comecando a explorar melhor o Figma, quero renderizar meus prototipos mais interativos e dinamicos. Ao comecar a usar transicoes basicas, meus cliques nao davam certo e fluia mal entre os frames.',
    curtidas: 3,
    autorId: 'usr4',
  },
  {
    id: 'com-2',
    postId: 'post-2',
    conteudo:
      'Uma dica que eu usei foi duplicar frames pra simular pausas. Parece gambiarra, mas funciona super bem combinando essas duas funcoes.',
    curtidas: 5,
    autorId: 'usr5',
  },
];

export let usuarios = [
  {
    id: 'usr1',
    nome: 'Usuario Qualquer',
    email: 'usuario@exemplo.com',
    senha: null, // nunca exposto pelo backend real; aqui so decorativo
    avatar: null,
    inep: '32123456',
    isAtivo: true,
    isAdmin: false,
    serieEscolarId: 'se3',
    areaIds: ['ar3', 'ar6'],
    favoritoOlimpiadaIds: ['ol-obt', 'ol-obb', 'ol-obr', 'ol-canguru'],
    temaEscuro: false,
  },
  { id: 'usr2', nome: 'Marina Alves', email: 'marina@exemplo.com', avatar: null },
  { id: 'usr3', nome: 'Renan Souza', email: 'renan@exemplo.com', avatar: null },
  { id: 'usr4', nome: 'Pedro Ferreira', email: 'pedro@exemplo.com', avatar: null },
  { id: 'usr5', nome: 'Cristina', email: 'cristina@exemplo.com', avatar: null },
];

export let colecoes = [
  { id: 'col1', nome: 'Minhas olimpiadas', corHex: '#767c3c', usuarioId: 'usr1', edicaoIds: [] },
];

// AcompanhamentoColecao: aqui mora tanto "estou inscrito" quanto a
// premiacao (quando existe) de uma edicao especifica para o usuario.
export let acompanhamentos = [
  { id: 'ac1', usuarioId: 'usr1', edicaoId: 'ed-oba-2026', inscrito: true, premiacao: 'Ouro', observacoes: null, colecaoId: null },
  { id: 'ac2', usuarioId: 'usr1', edicaoId: 'ed-obt-2026', inscrito: true, premiacao: null, observacoes: null, colecaoId: 'col1' },
  { id: 'ac3', usuarioId: 'usr1', edicaoId: 'ed-obt-2025', inscrito: true, premiacao: 'Prata', observacoes: null, colecaoId: null },
  { id: 'ac4', usuarioId: 'usr1', edicaoId: 'ed-obb-2024', inscrito: true, premiacao: 'Bronze', observacoes: null, colecaoId: null },
  { id: 'ac5', usuarioId: 'usr1', edicaoId: 'ed-obr-2024', inscrito: true, premiacao: 'Bronze', observacoes: null, colecaoId: null },
  { id: 'ac6', usuarioId: 'usr1', edicaoId: 'ed-obb-2026', inscrito: true, premiacao: null, observacoes: null, colecaoId: 'col1' },
  { id: 'ac7', usuarioId: 'usr1', edicaoId: 'ed-canguru-2026', inscrito: false, premiacao: null, observacoes: null, colecaoId: 'col1' },
];

// Usuario "logado" no modo mock.
export const MOCK_USER_ID = 'usr1';

let nextId = 1000;
export function generateId(prefix) {
  nextId += 1;
  return `${prefix}-${nextId}`;
}
