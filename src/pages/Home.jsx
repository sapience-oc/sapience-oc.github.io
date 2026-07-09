import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BottomNav from '../components/BottomNav';
import OlympiadCard from '../components/OlympiadCard';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { listOlimpiadas, listAreas, toggleFavorito } from '../api/olimpiadas';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAreas().then(setAreas);
  }, []);

  useEffect(() => {
    setLoading(true);
    listOlimpiadas({ areaId: activeAreaId }).then((data) => {
      setOlimpiadas(data);
      setLoading(false);
    });
  }, [activeAreaId]);

  async function handleToggleFavorito(id) {
    const updated = await toggleFavorito(id);
    setOlimpiadas((prev) => prev.map((o) => (o.id === id ? updated : o)));
  }

  const destaque = olimpiadas.find((o) => o.edicaoAtual?.status === 'inscricoes_abertas');
  const lista = olimpiadas
    .filter((o) => o.id !== destaque?.id)
    .filter((o) => o.nome.toLowerCase().includes(query.toLowerCase()) || o.sigla.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <GradientSheet
        maxHeight={175}
        minHeight={80}
        headerContent={
          <div>
            <Avatar src={user?.avatar} initials={user?.initials} size={34} />
            <h1 className="home-greeting">Ola, estudante!</h1>
            <p className="home-greeting-sub">Explore Olimpiadas</p>
          </div>
        }
      >
        <div className="overlap-card home-search">
          <Search size={16} color="var(--text-secondary)" />
          <input
            placeholder="Buscar por area ou olimpiada"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="home-filters">
          <button
            className={`filter-pill ${!activeAreaId ? 'active' : ''}`}
            onClick={() => setActiveAreaId(null)}
          >
            Todas
          </button>
          {areas.map((area) => (
            <button
              key={area.id}
              className={`filter-pill ${activeAreaId === area.id ? 'active' : ''}`}
              onClick={() => setActiveAreaId(area.id)}
            >
              {area.nome}
            </button>
          ))}
        </div>

        {destaque && (
          <>
            <h2 className="section-title">Em destaque</h2>
            <button
              className="featured-card"
              style={{ background: `linear-gradient(135deg, ${destaque.corDestaque}, #223018)` }}
              onClick={() => navigate(`/olimpiada/${destaque.id}`)}
            >
              <span className="featured-badge">Inscricoes abertas</span>
              <div className="featured-name">{destaque.sigla} {destaque.edicaoAtual?.ano}</div>
              <div className="featured-desc">{destaque.nome}</div>
              {destaque.proximoPrazo && (
                <div className="featured-footer">
                  <span>Encerra em {Math.max(destaque.proximoPrazo.diasRestantes, 0)} dias!</span>
                  <span className="featured-link">Ver edital</span>
                </div>
              )}
            </button>
          </>
        )}

        <h2 className="section-title">Proximos prazos</h2>
        {loading && <p className="muted-text">Carregando...</p>}
        {!loading && lista.length === 0 && (
          <p className="muted-text">Nenhuma olimpiada encontrada para esse filtro.</p>
        )}
        {lista.map((o) => (
          <OlympiadCard key={o.id} olimpiada={o} onToggleFavorito={handleToggleFavorito} />
        ))}
      </GradientSheet>
      <BottomNav />
    </>
  );
}
