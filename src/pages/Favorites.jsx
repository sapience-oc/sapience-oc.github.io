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
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro(null);
    listFavoritos()
      .then((data) => {
        if (!ativo) return;
        setFavoritos(data);
      })
      .catch((err) => {
        if (!ativo) return;
        console.error('Erro ao carregar favoritos:', err);
        setErro('Nao foi possivel carregar seus favoritos agora. Tente novamente.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function handleToggleFavorito(id) {
    try {
      const updated = await toggleFavorito(id);
      setFavoritos((prev) =>
        updated.favoritado ? prev.map((o) => (o.id === id ? updated : o)) : prev.filter((o) => o.id !== id)
      );
    } catch (err) {
      console.error('Erro ao favoritar/desfavoritar:', err);
    }
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
        {!loading && erro && <p className="muted-text">{erro}</p>}
        {!loading && !erro && favoritos.length === 0 && (
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
