import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { TextField, PrimaryButton } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Modo mock: qualquer usuario/senha preenchidos funcionam.
      await login(identifier, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Nao foi possivel entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">Login</h1>
      <p className="auth-subtitle">Faca login para continuar.</p>

      {successMessage && <div className="auth-banner">{successMessage}</div>}
      {error && <div className="auth-banner error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome ou e-mail"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          required
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div style={{ marginTop: 8 }}>
          <PrimaryButton type="submit" loading={loading}>
            Log in
          </PrimaryButton>
        </div>
      </form>

      <div className="auth-links">
        <Link to="/esqueci-senha">Esqueceu a senha?</Link>
        <Link to="/cadastro">Cadastre-se</Link>
      </div>
    </AuthLayout>
  );
}
