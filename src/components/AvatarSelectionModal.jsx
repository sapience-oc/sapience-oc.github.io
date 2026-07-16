import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { listarAvatares } from '../api/usuario';
import './AvatarSelectionModal.css';

export default function AvatarSelectionModal({ isOpen, onClose, onSelect }) {
  const [avatares, setAvatares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      listarAvatares()
        .then(setAvatares)
        .catch((err) => console.error('Erro ao carregar avatares:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="avatar-modal-overlay" onClick={onClose}>
      <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="avatar-modal-header">
          <h3>Escolha seu avatar</h3>
          <button className="avatar-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="avatar-modal-body">
          {loading ? (
            <p className="muted-text">Carregando avatares...</p>
          ) : (
            <div className="avatar-grid">
              {avatares.map((av) => (
                <button
                  key={av.id}
                  className="avatar-grid-item"
                  onClick={() => onSelect(av.id, av.url)}
                >
                  <img src={av.url} alt={`Avatar ${av.id}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}