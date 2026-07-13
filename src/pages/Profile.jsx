import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, KeyRound, LogOut, Moon, Pencil, Trophy } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';
import { Switch } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { listAcompanhamentos } from '../api/usuario';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [acompanhamentos, setAcompanhamentos] = useState([]);

  useEffect(() => {
    listAcompanhamentos()
      .then(setAcompanhamentos)
      .catch((err) => console.error('Erro ao carregar acompanhamentos:', err));
  }, []);

  const totalPremios = acompanhamentos.filter((a) => a.premiacao).length;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <GradientSheet
        maxHeight={175}
        minHeight={84}
        headerContent={
          <div className="profile-header">
            <Avatar src={user?.avatar} initials={user?.initials} size={64} />
            <h1 className="profile-name">{user?.nome || 'Usuario'}</h1>
            <p className="profile-sub">
              {user?.serieEscolar?.nome}
              {user?.serieEscolar && ''}
            </p>
          </div>
        }
      >
        <h2 className="section-title">Conta</h2>
        <div className="settings-list">
          <button className="settings-row" onClick={() => navigate('/perfil/editar')}>
            <span className="settings-row-icon">
              <Pencil size={17} />
            </span>
            <span className="settings-row-label">Editar informações</span>
            <ChevronRight size={17} color="var(--text-secondary)" />
          </button>

          <button className="settings-row" onClick={() => navigate('/perfil/senha')}>
            <span className="settings-row-icon">
              <KeyRound size={17} />
            </span>
            <span className="settings-row-label">Trocar senha</span>
            <ChevronRight size={17} color="var(--text-secondary)" />
          </button>

          <div className="settings-row no-hover">
            <span className="settings-row-icon">
              <Moon size={17} />
            </span>
            <span className="settings-row-label">Modo escuro</span>
            <Switch checked={isDark} onChange={toggleTheme} />
          </div>

          <button className="settings-row" onClick={() => navigate('/premiacoes')}>
            <span className="settings-row-icon">
              <Trophy size={17} />
            </span>
            <span className="settings-row-label">Premiações</span>
            <span className="settings-row-chip">{totalPremios}</span>
            <ChevronRight size={17} color="var(--text-secondary)" />
          </button>
        </div>

        {user?.inep && (
          <div className="inep-box">
            <div className="info-label">INEP da escola</div>
            <div className="info-value">{user.inep}</div>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Sair da conta
        </button>
      </GradientSheet>
      <BottomNav />
    </>
  );
}