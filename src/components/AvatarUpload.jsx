import { useState } from 'react';
import { Camera } from 'lucide-react';
import Avatar from './Avatar';
import AvatarSelectionModal from './AvatarSelectionModal';
import './AvatarUpload.css';

export default function AvatarUpload({ value, initials, onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSelect(avatarId, avatarUrl) {
    onChange(avatarId, avatarUrl);
    setIsModalOpen(false);
  }

  return (
    <div className="avatar-editor">
      <div className="avatar-editor-preview">
        <Avatar src={value} initials={initials} size={84} />
        <button
          type="button"
          className="avatar-editor-camera"
          onClick={() => setIsModalOpen(true)}
          aria-label="Trocar foto de perfil"
        >
          <Camera size={15} />
        </button>
      </div>
      
      <div className="avatar-editor-actions">
        <button type="button" className="avatar-editor-link" onClick={() => setIsModalOpen(true)}>
          {value ? 'Trocar avatar' : 'Escolher avatar'}
        </button>
      </div>

      <AvatarSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelect} 
      />
    </div>
  );
}