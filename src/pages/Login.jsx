import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { TextField, PasswordField, PrimaryButton } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';

function getLoginErrorMessage(err) {
  if (err.status === 0 || err.message.includes('Sem conexão')) {
    return 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
  }
  
  if (err.status === 401) {
    return 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.';
  }
  
  if (err.status === 400) {
    return err.message || 'Dados inválidos. Verifique o formulário.';
  }
  
  if (err.status >= 500) {
    return 'Ocorreu um erro em nossos servidores. Tente novamente em alguns instantes.';
  }
  
  return err.message || 'Não foi possível fazer login. Tente novamente.';
}

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
      await login(identifier, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">Login</h1>
      <p className="auth-subtitle">Faça login para continuar.</p>

      {successMessage && <div className="auth-banner">{successMessage}</div>}
      {error && <div className="auth-banner error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="E-mail ou nome de usuário"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          required
        />
        <PasswordField
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div style={{ marginTop: 8 }}>
          <PrimaryButton type="submit" loading={loading}>
            Entrar
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