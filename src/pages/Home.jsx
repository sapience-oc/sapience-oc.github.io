import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BottomNav from '../components/BottomNav';
import OlympiadCard from '../components/OlympiadCard';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { listOlimpiadas, listAreas, toggleFavorito } from '../api/olimpiadas';
import { prazoAtivo } from '../utils/prazo';
import './Home.css';

function primeiroNome(nomeCompleto) {
  if (!nomeCompleto) return 'estudante';
  const primeiro = nomeCompleto.trim().split(/\s+/)[0];
  return primeiro || 'estudante';
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listAreas()
      .then((data) => setAreas(data))
      .catch((err) => console.error('Erro ao carregar áreas:', err));
  }, []);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErro(null);
    listOlimpiadas({ areaId: activeAreaId })
      .then((data) => {
        if (ativo) setOlimpiadas(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar olimpiadas:', err);
        if (ativo) setErro('Não foi possível carregar as olimpíadas agora. Tente novamente.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [activeAreaId]);

  async function handleToggleFavorito(id) {
    const updated = await toggleFavorito(id);
    setOlimpiadas((prev) => prev.map((o) => (o.id === id ? updated : o)));
  }

  function handleSearch() {
    setSearchTerm(query.trim());
  }

  function handleClear() {
    setQuery('');
    setSearchTerm('');
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }

  const emBusca = searchTerm.length > 0;

  const destaque = olimpiadas.find((o) => o.edicaoAtual?.status === 'inscricoes_abertas');

  const proximosPrazos = useMemo(() => {
    const areasDoUsuario = new Set((user?.areas || []).map((a) => a.id));

    return olimpiadas
      .filter((o) => o.id !== destaque?.id)
      .slice()
      .sort((a, b) => {
        const aInteresse = a.areas?.some((ar) => areasDoUsuario.has(ar.id)) ? 0 : 1;
        const bInteresse = b.areas?.some((ar) => areasDoUsuario.has(ar.id)) ? 0 : 1;
        if (aInteresse !== bInteresse) return aInteresse - bInteresse;

        const diasA = prazoAtivo(a.proximoPrazo)?.diasRestantes ?? Infinity;
        const diasB = prazoAtivo(b.proximoPrazo)?.diasRestantes ?? Infinity;
        return diasA - diasB;
      });
  }, [olimpiadas, destaque, user]);

  const resultadosBusca = useMemo(() => {
    if (!searchTerm) return [];
    const termo = searchTerm.toLowerCase();
    return olimpiadas.filter((o) => {
      const camposTexto = [o.nome, o.sigla, o.organizador];
      const bateTexto = camposTexto.some((campo) => campo?.toLowerCase().includes(termo));
      const bateArea = (o.areas || []).some((a) => a.nome?.toLowerCase().includes(termo));
      const bateTipoInscricao = (o.tiposInscricao || []).some((t) =>
        t.nome?.toLowerCase().includes(termo)
      );
      return bateTexto || bateArea || bateTipoInscricao;
    });
  }, [olimpiadas, searchTerm]);

  return (
    <>
      <GradientSheet
        maxHeight={175}
        minHeight={80}
        headerContent={
          <div>
            <Avatar src={user?.avatar} initials={user?.initials} size={34} />
            <h1 className="home-greeting">Olá, {primeiroNome(user?.nome)}!</h1>
            <p className="home-greeting-sub">Explore Olimpíadas</p>
          </div>
        }
      >
        <div className="overlap-card home-search">
          <button
            type="button"
            className="home-search-icon-btn"
            onClick={handleSearch}
            aria-label="Pesquisar"
          >
            <Search size={16} color="var(--text-secondary)" />
          </button>
          <input
            placeholder="Buscar por área ou olimpíada"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          {query && (
            <button
              type="button"
              className="home-search-clear-btn"
              onClick={handleClear}
              aria-label="Limpar busca"
            >
              <X size={16} color="var(--text-secondary)" />
            </button>
          )}
        </div>

        {emBusca && (
          <p className="home-search-feedback">
            {resultadosBusca.length > 0
              ? `Mostrando resultados para "${searchTerm}"`
              : 'Nenhum resultado encontrado.'}
          </p>
        )}

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

        {loading && <p className="muted-text">Carregando...</p>}
        {!loading && erro && <p className="muted-text">{erro}</p>}

        {!loading && !erro && emBusca && resultadosBusca.length > 0 && (
          <>
            <h2 className="section-title">Resultados</h2>
            {resultadosBusca.map((o) => (
              <OlympiadCard key={o.id} olimpiada={o} onToggleFavorito={handleToggleFavorito} />
            ))}
          </>
        )}

        {!loading && !erro && !emBusca && (
          <>
            {destaque && (
              <>
                <h2 className="section-title">Em destaque</h2>
                <button
                  className="featured-card"
                  style={{ background: `linear-gradient(135deg, ${destaque.corDestaque}, #223018)` }}
                  onClick={() => navigate(`/olimpiada/${destaque.id}`)}
                >
                  <span className="featured-badge">Inscrições abertas</span>
                  <div className="featured-name">{destaque.sigla} {destaque.edicaoAtual?.ano}</div>
                  <div className="featured-desc">{destaque.nome}</div>
                  {prazoAtivo(destaque.proximoPrazo) && (
                    <div className="featured-footer">
                      <span>Encerra em {prazoAtivo(destaque.proximoPrazo).diasRestantes} dias!</span>
                      <span className="featured-link">Ver edital</span>
                    </div>
                  )}
                </button>
              </>
            )}

            <h2 className="section-title">Próximos prazos</h2>
            {proximosPrazos.length === 0 && (
              <p className="muted-text">Nenhuma olimpíada encontrada para esse filtro.</p>
            )}
            {proximosPrazos.map((o) => (
              <OlympiadCard key={o.id} olimpiada={o} onToggleFavorito={handleToggleFavorito} />
            ))}
          </>
        )}
      </GradientSheet>
      <BottomNav />
    </>
  );
}