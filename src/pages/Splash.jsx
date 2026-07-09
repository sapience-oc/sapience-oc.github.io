import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="splash gradient-bg">
      <div className="splash-center">
        <Logo size={110} />
      </div>
      <button className="splash-cta" onClick={() => navigate('/login')}>
        COMECAR AGORA!
      </button>
    </div>
  );
}
