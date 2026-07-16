import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import AvatarUpload from '../components/AvatarUpload';
import { TextField, SelectField, PrimaryButton } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { listSeriesEscolares } from '../api/usuario';
import { listAreas } from '../api/olimpiadas';
import './EditProfile.css';

function apenasNumeros(valor) {
  return valor.replace(/\D/g, '');
}

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    inep: user?.inep || '',
    serieEscolarId: user?.serieEscolar?.id || '',
    areaIds: (user?.areas || []).map((a) => a.id),
    avatarId: user?.avatarId || null,
    avatarUrl: user?.avatar || null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    listSeriesEscolares()
      .then(setSeries)
      .catch((err) => console.error('Erro ao carregar series escolares:', err));
    listAreas()
      .then(setAreas)
      .catch((err) => console.error('Erro ao carregar areas:', err));
  }, []);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function toggleArea(areaId) {
    setForm((prev) => ({
      ...prev,
      areaIds: prev.areaIds.includes(areaId)
        ? prev.areaIds.filter((id) => id !== areaId)
        : [...prev.areaIds, areaId],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { avatarId, avatarUrl, ...dadosBasicos } = form;
      const payload = { ...dadosBasicos };
      if (avatarId !== user?.avatarId) {
        payload.avatarId = avatarId;
      }

      await updateProfile(payload);
      setSaved(true);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <GradientSheet
      maxHeight={120}
      minHeight={90}
      headerContent={
        <div>
          <BackHeader onBack={() => navigate(-1)} />
          <h1 className="edit-title">Editar informações</h1>
        </div>
      }
    >
      <AvatarUpload
        value={form.avatarUrl}
        initials={user?.initials}
        onChange={(newAvatarId, newAvatarUrl) => 
          setForm((prev) => ({ 
            ...prev, 
            avatarId: newAvatarId, 
            avatarUrl: newAvatarUrl 
          }))
        }
      />

      <form onSubmit={handleSubmit}>
        <TextField label="Nome" type="text" value={form.nome} onChange={update('nome')} required />
        <TextField label="E-mail" type="email" value={form.email} onChange={update('email')} required />
        <TextField
          label="INEP da escola"
          optional
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={form.inep}
          onChange={(e) => setForm((prev) => ({ ...prev, inep: apenasNumeros(e.target.value) }))}
        />
        <SelectField label="Série escolar" value={form.serieEscolarId} onChange={update('serieEscolarId')}>
          <option value="" disabled>
            Selecione
          </option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </SelectField>

        <span className="field-label" style={{ display: 'block', marginBottom: 8 }}>
          Áreas de interesse
        </span>
        <div className="area-chip-grid">
          {areas.map((a) => (
            <button
              type="button"
              key={a.id}
              className={`area-chip ${form.areaIds.includes(a.id) ? 'active' : ''}`}
              onClick={() => toggleArea(a.id)}
            >
              {a.nome}
            </button>
          ))}
        </div>

        {saved && <div className="auth-banner" style={{ marginTop: 18 }}>Informações salvas!</div>}

        <div style={{ marginTop: 22 }}>
          <PrimaryButton type="submit" loading={saving}>
            Salvar alterações
          </PrimaryButton>
        </div>
      </form>
    </GradientSheet>
  );
}