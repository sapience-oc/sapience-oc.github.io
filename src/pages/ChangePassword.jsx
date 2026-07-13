import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientSheet from '../components/GradientSheet';
import BackHeader from '../components/BackHeader';
import { TextField, PrimaryButton } from '../components/FormControls';
import { alterarSenha } from '../api/usuario';
import './ChangePassword.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaved(false);

    if (novaSenha.length < 6) {
      setError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError('As senhas nao coincidem.');
      return;
    }

    setSaving(true);
    try {
      await alterarSenha({ senhaAtual, novaSenha });
      setSaved(true);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err) {
      setError(err.message || 'Nao foi possivel trocar a senha. Confira a senha atual.');
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
          <h1 className="edit-title">Trocar senha</h1>
        </div>
      }
    >
      {error && <div className="auth-banner error">{error}</div>}
      {saved && <div className="auth-banner">Senha alterada com sucesso!</div>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          required
        />
        <TextField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
        />
        <TextField
          label="Confirme a nova senha"
          type="password"
          autoComplete="new-password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        <div style={{ marginTop: 22 }}>
          <PrimaryButton type="submit" loading={saving}>
            Salvar nova senha
          </PrimaryButton>
        </div>
      </form>
    </GradientSheet>
  );
}