import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, MessageCircle, Plus, Star, X } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import { TextField, TextArea, PrimaryButton } from '../components/FormControls';
import { getOlimpiada, getEdicao, listPosts, createPost, toggleFavorito } from '../api/olimpiadas';
import { openExternal } from '../utils/links';
import './OlympiadDetail.css';

const STATUS_LABEL = {
  em_breve: 'Em breve',
  inscricoes_abertas: 'Inscricoes abertas',
  em_andamento: 'Em andamento',
  encerrada: 'Encerrada',
};

function formatarData(iso) {
  if (!iso) return '-';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function NewTopicForm({ forumId, onCreated, onCancel }) {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) {
      setError('Preencha o titulo e a duvida antes de publicar.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const novo = await createPost(forumId, { titulo: titulo.trim(), conteudo: conteudo.trim() });
      onCreated(novo);
    } catch (err) {
      setError(err.message || 'Nao foi possivel publicar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="new-topic-form" onSubmit={handleSubmit}>
      <div className="new-topic-header">
        <span>Novo topico</span>
        <button type="button" onClick={onCancel} aria-label="Fechar">
          <X size={18} />
        </button>
      </div>
      {error && <div className="auth-banner error">{error}</div>}
      <TextField
        label="Titulo"
        type="text"
        placeholder="Resuma sua duvida em uma frase"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <TextArea
        label="Duvida ou comentario"
        placeholder="Descreva com mais detalhes..."
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        rows={4}
        required
      />
      <PrimaryButton type="submit" loading={saving}>
        Publicar topico
      </PrimaryButton>
    </form>
  );
}

export default function OlympiadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [olimpiada, setOlimpiada] = useState(null);
  const [edicaoId, setEdicaoId] = useState(null);
  const [edicao, setEdicao] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showNewTopic, setShowNewTopic] = useState(false);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErro(null);
    getOlimpiada(id)
      .then((data) => {
        if (!ativo) return;
        setOlimpiada(data);
        const inicial = data?.edicaoAtual?.id || data?.edicoes?.[0]?.id || null;
        setEdicaoId(inicial);
      })
      .catch((err) => {
        console.error('Erro ao carregar olimpiada:', err);
        if (ativo) setErro('Nao foi possivel carregar essa olimpiada agora.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(() => {
    if (!edicaoId) return;
    getEdicao(edicaoId)
      .then(setEdicao)
      .catch((err) => console.error('Erro ao carregar edicao:', err));
  }, [edicaoId]);

  useEffect(() => {
    setShowNewTopic(false);
    if (!edicao?.forum) {
      setPosts([]);
      return;
    }
    listPosts(edicao.forum.id)
      .then((data) => setPosts(data))
      .catch((err) => console.error('Erro ao carregar posts:', err));
  }, [edicao?.forum?.id]);

  async function handleToggleFavorito() {
    const updated = await toggleFavorito(id);
    setOlimpiada((prev) => ({ ...prev, favoritado: updated.favoritado }));
  }

  if (loading) return null;

  if (erro) {
    return (
      <GradientSheet maxHeight={110} minHeight={90} headerContent={<BackHeader onBack={() => navigate(-1)} />}>
        <p className="muted-text">{erro}</p>
      </GradientSheet>
    );
  }

  if (!olimpiada) {
    return (
      <GradientSheet maxHeight={110} minHeight={90} headerContent={<BackHeader onBack={() => navigate(-1)} />}>
        <p className="muted-text">Olimpiada nao encontrada.</p>
      </GradientSheet>
    );
  }

  return (
    <GradientSheet
      maxHeight={225}
      minHeight={100}
      headerContent={
        <div>
          <BackHeader onBack={() => navigate(-1)} />
          <div className="detail-title-row">
            {olimpiada.imagemUrl ? (
              <img className="detail-image" src={olimpiada.imagemUrl} alt="" />
            ) : (
              <div className="detail-image placeholder" style={{ background: olimpiada.corDestaque }}>
                {olimpiada.sigla?.slice(0, 3).toUpperCase()}
              </div>
            )}
            <div className="detail-title-text">
              <h1 className="detail-title">
                {olimpiada.sigla} {edicao ? edicao.ano : ''}
              </h1>
              <p className="detail-subtitle">{olimpiada.nome}</p>
            </div>
          </div>

          {olimpiada.edicoes?.length > 1 && (
            <div className="edition-picker">
              {olimpiada.edicoes.map((ed) => (
                <button
                  key={ed.id}
                  className={`edition-pill ${ed.id === edicaoId ? 'active' : ''}`}
                  onClick={() => setEdicaoId(ed.id)}
                >
                  {ed.ano}
                </button>
              ))}
            </div>
          )}
        </div>
      }
    >
      {!edicao ? (
        <p className="muted-text">Carregando edicao...</p>
      ) : (
        <>
          <div className="detail-tags">
            {edicao.olimpiada.areas.map((a) => (
              <span key={a.id} className="detail-tag">
                {a.nome}
              </span>
            ))}
            {edicao.nivel && <span className="detail-tag">{edicao.nivel.nome}</span>}
            <span className="detail-tag status">{STATUS_LABEL[edicao.status]}</span>
          </div>

          {edicao.prazos.length > 0 && (
            <div className="detail-info-grid">
              {edicao.prazos.map((p) => (
                <div key={p.id} className="info-box">
                  <div className="info-label">{p.tipoPrazo?.nome || p.nome}</div>
                  <div className="info-value">{formatarData(p.data)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="detail-two-col">
            <div className="info-box">
              <div className="info-label">Organizador</div>
              <div className="info-value">{edicao.olimpiada.organizador || '-'}</div>
            </div>
            {edicao.olimpiada.siteOficial && (
              <button
                type="button"
                className="info-box link"
                onClick={() => openExternal(edicao.olimpiada.siteOficial)}
              >
                <div className="info-label">Site oficial</div>
                <div className="info-value">
                  Visitar <ExternalLink size={12} />
                </div>
              </button>
            )}
          </div>

          {edicao.regulamento && (
            <button
              type="button"
              className="regulamento-link"
              onClick={() => openExternal(edicao.regulamento)}
            >
              Ver regulamento / edital desta edicao
            </button>
          )}

          {edicao.forum && (
            <>
              <div className="section-title-row">
                <h2 className="section-title">Duvidas e comentarios</h2>
                {!showNewTopic && (
                  <button className="new-topic-btn" onClick={() => setShowNewTopic(true)}>
                    <Plus size={14} />
                    Novo topico
                  </button>
                )}
              </div>

              {showNewTopic && (
                <NewTopicForm
                  forumId={edicao.forum.id}
                  onCancel={() => setShowNewTopic(false)}
                  onCreated={(novo) => {
                    setPosts((prev) => [novo, ...prev]);
                    setShowNewTopic(false);
                  }}
                />
              )}

              <div className="thread-list">
                {posts.map((p) => (
                  <button key={p.id} className="thread-item" onClick={() => navigate(`/posts/${p.id}`)}>
                    <MessageCircle size={18} color="var(--olive-600)" />
                    <div>
                      <div className="thread-title">{p.titulo}</div>
                      <div className="thread-meta">
                        {p.totalComentarios} resposta{p.totalComentarios === 1 ? '' : 's'}
                      </div>
                    </div>
                  </button>
                ))}
                {posts.length === 0 && !showNewTopic && (
                  <p className="muted-text">Nenhuma duvida por aqui ainda nessa edicao. Seja o primeiro a perguntar!</p>
                )}
              </div>
            </>
          )}
        </>
      )}

      <button className={`fav-btn ${olimpiada.favoritado ? 'active' : ''}`} onClick={handleToggleFavorito}>
        <Star size={16} fill={olimpiada.favoritado ? 'currentColor' : 'none'} />
        {olimpiada.favoritado ? 'Olimpiada favoritada' : 'Favoritar esta olimpiada'}
      </button>
    </GradientSheet>
  );
}