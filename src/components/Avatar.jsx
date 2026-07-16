import { getImageUrl } from '../utils/image';
import './Avatar.css';

export default function Avatar({ src, initials, size = 64, editable = false, onClick }) {
  const imageUrl = src ? getImageUrl(src) : null;

  const content = imageUrl ? (
    <img 
      src={imageUrl} 
      alt="Avatar" 
      className="avatar-img" 
    />
  ) : (
    <span className="avatar-initials" style={{ fontSize: size * 0.35 }}>
      {initials || '??'}
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