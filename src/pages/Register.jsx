import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import BackHeader from '../components/BackHeader';
import AvatarUpload from '../components/AvatarUpload';
import { TextField, SelectField, PrimaryButton } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { listSeriesEscolares } from '../api/usuario';
import { listAreas } from '../api/olimpiadas';

const initialForm = {
  email: '',
  nome: '',
  serieEscolarId: '',
  inep: '',
  areaIds: [],
  avatar: null,
  password: '',
  confirmPassword: '',
};

function apenasNumeros(valor) {
  return valor.replace(/\D/g, '');
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }
    if (form.areaIds.length === 0) {
      setError('Selecione ao menos uma area de interesse.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: form.nome,
        email: form.email,
        serieEscolarId: form.serieEscolarId,
        inep: form.inep,
        areaIds: form.areaIds,
        avatar: form.avatar,
      });
      navigate('/login', {
        replace: true,
        state: { message: 'Cadastro realizado! Faca login para continuar.' },
      });
    } catch (err) {
      setError(err.message || 'Nao foi possivel concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout topSlot={<BackHeader dark />}>
      <h1 className="auth-title">Cadastro</h1>
      <p className="auth-subtitle">Entre com seus dados</p>

      {error && <div className="auth-banner error">{error}</div>}

      <AvatarUpload
        value={form.avatar}
        initials={form.nome ? form.nome.slice(0, 2).toUpperCase() : '??'}
        onChange={(avatar) => setForm((prev) => ({ ...prev, avatar }))}
      />

      <form onSubmit={handleSubmit}>
        <TextField label="*E-mail" type="email" value={form.email} onChange={update('email')} required />
        <TextField label="*Nome" type="text" value={form.nome} onChange={update('nome')} required />
        <SelectField label="*Serie escolar" value={form.serieEscolarId} onChange={update('serieEscolarId')} required>
          <option value="" disabled>
            Selecione
          </option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </SelectField>
        <TextField
          label="INEP da escola"
          optional
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={form.inep}
          onChange={(e) => setForm((prev) => ({ ...prev, inep: apenasNumeros(e.target.value) }))}
        />

        <span className="field-label" style={{ display: 'block', marginBottom: 8 }}>
          *Areas de interesse
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

        <TextField
          label="*Senha"
          type="password"
          value={form.password}
          onChange={update('password')}
          required
        />
        <TextField
          label="*Confirme a senha"
          type="password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          required
        />

        <div style={{ marginTop: 8 }}>
          <PrimaryButton type="submit" loading={loading}>
            Continuar para Login
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}