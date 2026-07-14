import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import BackHeader from '../components/BackHeader';
import { TextField, PrimaryButton } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      navigate('/login', {
        replace: true,
        state: { message: 'Se o e-mail existir, enviamos uma nova senha. (Caso o e-mail com a senha não chegar, verifique a caixa de spam)' },
      });
    } catch (err) {
      setError(err.message || 'Nao foi possivel enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout topSlot={<BackHeader dark />}>
      <h1 className="auth-title">Esqueci a senha</h1>
      <p className="auth-subtitle">Digite o seu e-mail para receber a nova senha.</p>

      {error && <div className="auth-banner error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div style={{ marginTop: 8 }}>
          <PrimaryButton type="submit" loading={loading}>
            Enviar
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
