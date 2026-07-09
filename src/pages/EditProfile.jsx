import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2 } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import Avatar from '../components/Avatar';
import { TextField, SelectField, PrimaryButton } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { listSeriesEscolares } from '../api/usuario';
import { listAreas } from '../api/olimpiadas';
import { readAndResizeImage } from '../utils/image';
import './EditProfile.css';

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [series, setSeries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    inep: user?.inep || '',
    serieEscolarId: user?.serieEscolar?.id || '',
    areaIds: user?.areaIds || [],
    avatar: user?.avatar || null,
  });
  const [avatarError, setAvatarError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    listSeriesEscolares().then(setSeries);
    listAreas().then(setAreas);
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

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    if (!file) return;
    setAvatarError('');
    try {
      const dataUrl = await readAndResizeImage(file, { maxSize: 400, quality: 0.85 });
      setForm((prev) => ({ ...prev, avatar: dataUrl }));
    } catch (err) {
      setAvatarError(err.message || 'Nao foi possivel usar essa imagem.');
    }
  }

  function handleRemoveAvatar() {
    setForm((prev) => ({ ...prev, avatar: null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile(form);
      setSaved(true);
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
          <h1 className="edit-title">Editar informacoes</h1>
        </div>
      }
    >
      <div className="avatar-editor">
        <div className="avatar-editor-preview">
          <Avatar src={form.avatar} initials={user?.initials} size={84} />
          <button
            type="button"
            className="avatar-editor-camera"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Trocar foto de perfil"
          >
            <Camera size={15} />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div className="avatar-editor-actions">
          <button type="button" className="avatar-editor-link" onClick={() => fileInputRef.current?.click()}>
            Trocar foto
          </button>
          {form.avatar && (
            <button type="button" className="avatar-editor-link danger" onClick={handleRemoveAvatar}>
              <Trash2 size={13} />
              Remover
            </button>
          )}
        </div>
        {avatarError && <div className="auth-banner error">{avatarError}</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <TextField label="Nome" type="text" value={form.nome} onChange={update('nome')} required />
        <TextField label="E-mail" type="email" value={form.email} onChange={update('email')} required />
        <TextField label="INEP da escola" type="text" value={form.inep} onChange={update('inep')} />
        <SelectField label="Serie escolar" value={form.serieEscolarId} onChange={update('serieEscolarId')}>
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
          Areas de interesse
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

        {saved && <div className="auth-banner" style={{ marginTop: 18 }}>Informacoes salvas!</div>}

        <div style={{ marginTop: 22 }}>
          <PrimaryButton type="submit" loading={saving}>
            Salvar alteracoes
          </PrimaryButton>
        </div>
      </form>
    </GradientSheet>
  );
}
