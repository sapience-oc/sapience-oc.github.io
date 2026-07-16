import { getImageUrl } from '../utils/image';
import './Avatar.css';

function getInitials(nome) {
  if (!nome) return '??';
  
  const primeiroNome = nome.trim().split(/\s+/)[0];
  
  if (primeiroNome.length >= 2) {
    return primeiroNome.substring(0, 2).toUpperCase();
  }
  
  return '??';
}

export default function Avatar({ src, initials, nome, size = 64, editable = false, onClick }) {
  const imageUrl = src ? getImageUrl(src) : null;
  const displayInitials = initials || getInitials(nome) || '??';

  const content = imageUrl ? (
    <img 
      src={imageUrl} 
      alt="Avatar" 
      className="avatar-img" 
    />
  ) : (
    <span className="avatar-initials" style={{ fontSize: size * 0.35 }}>
      {displayInitials}
    </span>
  );

  return (
    <button
      type="button"
      className={`avatar ${editable ? 'editable' : ''}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      disabled={!editable}
    >
      {content}
    </button>
  );
}