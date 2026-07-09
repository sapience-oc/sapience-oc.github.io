import './Avatar.css';

export default function Avatar({ src, initials, size = 64, editable = false, onClick }) {
  const content = src ? (
    <img src={src} alt="" className="avatar-img" />
  ) : (
    <span className="avatar-initials" style={{ fontSize: size * 0.32 }}>
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
