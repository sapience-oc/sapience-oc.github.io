import { useEffect, useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import Avatar from './Avatar';
import { readAndResizeImage } from '../utils/image';
import { onNativeAvatar, requestNativeGalleryPick } from '../utils/nativeBridge';
import './AvatarUpload.css';

export default function AvatarUpload({ value, initials, onChange }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => onNativeAvatar((dataUrl) => onChange(dataUrl)), [onChange]);

  function handlePickClick() {
    requestNativeGalleryPick();
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    try {
      const dataUrl = await readAndResizeImage(file, { maxSize: 400, quality: 0.85 });
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || 'Nao foi possivel usar essa imagem.');
    }
  }

  return (
    <div className="avatar-editor">
      <div className="avatar-editor-preview">
        <Avatar src={value} initials={initials} size={84} />
        <button
          type="button"
          className="avatar-editor-camera"
          onClick={handlePickClick}
          aria-label="Trocar foto de perfil"
        >
          <Camera size={15} />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="avatar-editor-actions">
        <button type="button" className="avatar-editor-link" onClick={handlePickClick}>
          {value ? 'Trocar foto' : 'Adicionar foto'}
        </button>
        {value && (
          <button type="button" className="avatar-editor-link danger" onClick={() => onChange(null)}>
            <Trash2 size={13} />
            Remover
          </button>
        )}
      </div>
      {error && <div className="auth-banner error">{error}</div>}
    </div>
  );
}