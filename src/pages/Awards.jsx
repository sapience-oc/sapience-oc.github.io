import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, Trash2, X } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import { TextField, SelectField, PrimaryButton, GhostButton } from '../components/FormControls';
import { listOlimpiadas, getOlimpiada } from '../api/olimpiadas';
import { listPremiacoes, salvarAcompanhamento, removerPremiacao } from '../api/usuario';
import './Awards.css';

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
    listOlimpiadas().then(setOlimpiadas);
  }, []);

  useEffect(() => {
    if (!olimpiadaId) {
      setEdicoes([]);
      setEdicaoId('');
      return;
    }
    setLoadingEdicoes(true);
    getOlimpiada(olimpiadaId).then((data) => {
      setEdicoes(data?.edicoes || []);
      setEdicaoId('');
      setLoadingEdicoes(false);
    });
  }, [olimpiadaId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!edicaoId) {
      setError('Selecione a edicao da olimpiada.');
      return;
    }
    if (!premiacao.trim()) {
      setError('Descreva a premiacao (ex: Ouro, Medalha de bronze...).');
      return;
    }
    setSaving(true);
    try {
      await salvarAcompanhamento({ edicaoId, premiacao: premiacao.trim(), inscrito: true });
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
        <span>Nova premiacao</span>
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

      <TextField
        label="Premiacao"
        type="text"
        placeholder="Ex: Ouro, Prata, Bronze, Mencao honrosa..."
        value={premiacao}
        onChange={(e) => setPremiacao(e.target.value)}
        required
      />

      <PrimaryButton type="submit" loading={saving}>
        Salvar premiacao
      </PrimaryButton>
    </form>
  );
}

const PLACE_COLOR = {
  ouro: '#d9a441',
  prata: '#9aa3ad',
  bronze: '#b0703f',
};

function corDaPremiacao(texto = '') {
  const chave = texto.trim().toLowerCase();
  return PLACE_COLOR[chave] || 'var(--olive-500)';
}

export default function Awards() {
  const navigate = useNavigate();
  const [premiacoes, setPremiacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  function reload() {
    setLoading(true);
    listPremiacoes().then((data) => {
      setPremiacoes(data);
      setLoading(false);
    });
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
          <h1 className="awards-title">Premiacoes</h1>
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
          Adicionar premiacao
        </button>
      )}

      {loading && <p className="muted-text">Carregando...</p>}
      {!loading && premiacoes.length === 0 && (
        <p className="muted-text">Voce ainda nao registrou nenhuma premiacao.</p>
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
            <button className="award-remove" onClick={() => handleRemove(a.id)} aria-label="Remover premiacao">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </GradientSheet>
  );
}
