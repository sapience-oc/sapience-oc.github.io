import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, Send, Megaphone } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import { getPost, listComentarios, createComentario } from '../api/olimpiadas';
import './PostDetail.css';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErro(null);
    getPost(postId)
      .then((data) => {
        if (ativo) setPost(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar post:', err);
        if (ativo) setErro('Nao foi possivel carregar essa duvida agora.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    listComentarios(postId)
      .then(setComentarios)
      .catch((err) => console.error('Erro ao carregar comentarios:', err));
    return () => {
      ativo = false;
    };
  }, [postId]);

  async function handleSend(e) {
    e.preventDefault();
    if (!mensagem.trim()) return;
    setEnviando(true);
    try {
      const novo = await createComentario(postId, mensagem.trim());
      setComentarios((prev) => [...prev, novo]);
      setMensagem('');
    } finally {
      setEnviando(false);
    }
  }

  if (loading) return null;

  if (erro) {
    return (
      <GradientSheet maxHeight={110} minHeight={90} headerContent={<BackHeader onBack={() => navigate(-1)} />}>
        <p className="muted-text">{erro}</p>
      </GradientSheet>
    );
  }

  if (!post) {
    return (
      <GradientSheet maxHeight={110} minHeight={90} headerContent={<BackHeader onBack={() => navigate(-1)} />}>
        <p className="muted-text">Essa duvida nao foi encontrada.</p>
      </GradientSheet>
    );
  }

  return (
    <GradientSheet
      maxHeight={145}
      minHeight={90}
      headerContent={
        <div>
          <BackHeader onBack={() => navigate(-1)} />
          <div className="disc-header-row">
            <Megaphone size={28} color="#fff" />
            <div>
              <div className="disc-eyebrow">{post.olimpiada?.sigla}</div>
              <div className="disc-title">Duvidas e comentarios</div>
            </div>
          </div>
        </div>
      }
    >
      <div className="thread-op">
        <div className="thread-op-question">{post.titulo}</div>
        <p className="thread-op-body">{post.conteudo}</p>
        <div className="thread-op-author">Por: {post.autor?.nome || 'Estudante'}</div>
      </div>

      <form className="reply-input-row" onSubmit={handleSend}>
        <input
          placeholder="Responder..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button type="submit" disabled={enviando} aria-label="Enviar resposta">
          <Send size={16} />
        </button>
      </form>

      <div className="reply-list">
        <div className="reply-list-title">Respostas ({comentarios.length})</div>
        {comentarios.map((c) => (
          <div key={c.id} className="reply-item">
            <div className="reply-avatar">{c.autor?.initials || '??'}</div>
            <div className="reply-body">
              <div className="reply-meta">
                <span className="reply-author">{c.autor?.nome}</span>
              </div>
              <p className="reply-text">{c.conteudo}</p>
              <button className="reply-like">
                <Heart size={13} />
                {c.curtidas}
              </button>
            </div>
          </div>
        ))}
        {comentarios.length === 0 && <p className="muted-text">Seja o primeiro a responder.</p>}
      </div>
    </GradientSheet>
  );
}
