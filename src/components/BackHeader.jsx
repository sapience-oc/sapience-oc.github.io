import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BackHeader.css';

export default function BackHeader({ onBack, dark = false }) {
  const navigate = useNavigate();
  return (
    <button
      className={`back-header ${dark ? 'dark' : ''}`}
      onClick={() => (onBack ? onBack() : navigate(-1))}
    >
      <ArrowLeft size={16} />
      Voltar
    </button>
  );
}
