import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientSheet from '../components/GradientSheet';
import BottomNav from '../components/BottomNav';
import OlympiadCard from '../components/OlympiadCard';
import { listFavoritos, toggleFavorito } from '../api/olimpiadas';
import './Favorites.css';

export default function Favorites() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listFavoritos().then((data) => {
      setFavoritos(data);
      setLoading(false);
    });
  }, []);

  async function handleToggleFavorito(id) {
    const updated = await toggleFavorito(id);
    setFavoritos((prev) =>
      updated.favoritado ? prev.map((o) => (o.id === id ? updated : o)) : prev.filter((o) => o.id !== id)
    );
  }

  return (
    <>
      <GradientSheet
        maxHeight={155}
        minHeight={78}
        headerContent={
          <div>
            <span className="fav-star">&#9733;</span>
            <h1 className="fav-title">Olimpiadas</h1>
            <h1 className="fav-title strong">Favoritas</h1>
          </div>
        }
      >
        <button className="overlap-card fav-calendar-btn" onClick={() => navigate('/calendario')}>
          Ver calendario
        </button>

        {loading && <p className="muted-text">Carregando...</p>}
        {!loading && favoritos.length === 0 && (
          <p className="muted-text">Voce ainda nao favoritou nenhuma olimpiada.</p>
        )}
        {favoritos.map((o) => (
          <OlympiadCard key={o.id} olimpiada={o} onToggleFavorito={handleToggleFavorito} />
        ))}
      </GradientSheet>
      <BottomNav />
    </>
  );
}
