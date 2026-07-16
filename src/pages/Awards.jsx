import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, Trash2, X } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import { SelectField, PrimaryButton } from '../components/FormControls';
import { listOlimpiadas, getOlimpiada } from '../api/olimpiadas';
import { listPremiacoes, salvarAcompanhamento, removerPremiacao } from '../api/usuario';
import './Awards.css';

const PREMIACOES_VALIDAS = [
  'Ouro Nacional',
  'Prata Nacional',
  'Bronze Nacional',
  'Menção Honrosa Nacional',
  'Ouro Regional',
  'Prata Regional',
  'Bronze Regional',
  'Menção Honrosa Regional',
  'Troféu',
  'Honra ao Mérito',
];

function corDaPremiacao(texto = '') {
  const t = texto.toLowerCase();
  if (t.includes('ouro')) return '#d9a441';
  if (t.includes('prata')) return '#9aa3ad';
  if (t.includes('bronze')) return '#b0703f';
  if (t.includes('troféu') || t.includes('honra')) return '#8b5cf6';
  return 'var(--olive-500)';
}

function AddAwardForm({ onSaved, onCancel }) {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [edicoes, setEdicoes] = useState([]);
  const [olimpiadaId, setOlimpiadaId] = useState('');
  const [edicaoId, setEdicaoId] = useState('');
  const [premiacao, setPremiacao] = useState('');
  const [loadingEdicoes, setLoadingEdicoes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listOlimpiadas()
      .then(setOlimpiadas)
      .catch((err) => console.error('Erro ao carregar olimpiadas:', err));
  }, []);

  useEffect(() => {
    if (!olimpiadaId) {
      setEdicoes([]);
      setEdicaoId('');
      return;
    }
    let ativo = true;
    setLoadingEdicoes(true);
    getOlimpiada(olimpiadaId)
      .then((data) => {
        if (!ativo) return;
        setEdicoes(data?.edicoes || []);
        setEdicaoId('');
      })
      .catch((err) => {
        console.error('Erro ao carregar edicoes:', err);
        if (ativo) setError('Nao foi possivel carregar as edicoes dessa olimpiada.');
      })
      .finally(() => {
        if (ativo) setLoadingEdicoes(false);
      });
    return () => {
      ativo = false;
    };
  }, [olimpiadaId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!edicaoId) {
      setError('Selecione a edicao da olimpiada.');
      return;
    }
    if (!premiacao) {
      setError('Selecione a premiação.');
      return;
    }
    setSaving(true);
    try {
      await salvarAcompanhamento({ edicaoId, premiacao, inscrito: true });
      onSaved();
    } catch (err) {
      setError(err.message || 'Nao foi possivel salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="award-form" onSubmit={handleSubmit}>
      <div className="award-form-header">
        <span>Nova premiação</span>
        <button type="button" onClick={onCancel} aria-label="Fechar">
          <X size={18} />
        </button>
      </div>

      {error && <div className="auth-banner error">{error}</div>}

      <SelectField label="Olimpiada" value={olimpiadaId} onChange={(e) => setOlimpiadaId(e.target.value)} required>
        <option value="" disabled>
          Selecione uma olimpiada
        </option>
        {olimpiadas.map((o) => (
          <option key={o.id} value={o.id}>
            {o.sigla} - {o.nome}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Edicao"
        value={edicaoId}
        onChange={(e) => setEdicaoId(e.target.value)}
        required
        disabled={!olimpiadaId || loadingEdicoes}
      >
        <option value="" disabled>
          {loadingEdicoes ? 'Carregando...' : 'Selecione a edicao (ano)'}
        </option>
        {edicoes.map((ed) => (
          <option key={ed.id} value={ed.id}>
            {ed.ano}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Premiação"
        value={premiacao}
        onChange={(e) => setPremiacao(e.target.value)}
        required
      >
        <option value="" disabled>
          Selecione a premiação
        </option>
        {PREMIACOES_VALIDAS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </SelectField>

      <PrimaryButton type="submit" loading={saving}>
        Salvar premiação
      </PrimaryButton>
    </form>
  );
}

export default function Awards() {
  const navigate = useNavigate();
  const [premiacoes, setPremiacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function reload() {
    setLoading(true);
    setErro(null);
    listPremiacoes()
      .then((data) => setPremiacoes(data))
      .catch((err) => {
        console.error('Erro ao carregar premiações:', err);
        setErro('Nao foi possivel carregar suas premiações agora.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleRemove(id) {
    await removerPremiacao(id);
    reload();
  }

  return (
    <GradientSheet
      maxHeight={140}
      minHeight={90}
      headerContent={
        <div>
          <BackHeader onBack={() => navigate(-1)} />
          <h1 className="awards-title">Premiações</h1>
        </div>
      }
    >
      {showForm ? (
        <AddAwardForm
          onCancel={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            reload();
          }}
        />
      ) : (
        <button className="add-award-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Adicionar premiação
        </button>
      )}

      {loading && <p className="muted-text">Carregando...</p>}
      {!loading && erro && <p className="muted-text">{erro}</p>}
      {!loading && !erro && premiacoes.length === 0 && (
        <p className="muted-text">Voce ainda nao registrou nenhuma premiação.</p>
      )}

      <div className="awards-list">
        {premiacoes.map((a) => (
          <div key={a.id} className="award-item">
            <Award size={22} color={corDaPremiacao(a.premiacao)} />
            <div className="award-item-body">
              <div className="award-title">
                {a.edicao?.olimpiada?.sigla} - {a.edicao?.olimpiada?.nome}
              </div>
              <div className="award-place" style={{ color: corDaPremiacao(a.premiacao) }}>
                {a.premiacao} ({a.edicao?.ano})
              </div>
            </div>
            <button className="award-remove" onClick={() => handleRemove(a.id)} aria-label="Remover premiação">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </GradientSheet>
  );
}