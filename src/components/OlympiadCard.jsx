import { Heart, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { prazoAtivo } from '../utils/prazo';
import './OlympiadCard.css';
import { getImageUrl } from '../utils/image.js';


function urgencyColor(dias) {
  if (dias == null) return 'var(--olive-500)';
  if (dias <= 5) return 'var(--danger)';
  if (dias <= 14) return 'var(--gold)';
  return 'var(--olive-500)';
}

const STATUS_LABEL = {
  em_breve: 'Em breve',
  inscricoes_abertas: 'Inscricoes abertas',
  em_andamento: 'Em andamento',
  encerrada: 'Encerrada',
};

export default function OlympiadCard({ olimpiada, onToggleFavorito }) {
  const navigate = useNavigate();
  const areaPrincipal = olimpiada.areas?.[0]?.nome;
  const prazo = prazoAtivo(olimpiada.proximoPrazo);
  const stage = prazo
    ? prazo.nome
    : olimpiada.edicaoAtual
    ? STATUS_LABEL[olimpiada.edicaoAtual.status]
    : 'Sem edicao ativa';

  return (
    <button className="oly-card" onClick={() => navigate(`/olimpiada/${olimpiada.id}`)}>
      {olimpiada.imagemUrl ? (
        <img className="oly-card-image" src={getImageUrl(olimpiada.imagemUrl)} alt="" />
      ) : (
        <div className="oly-card-icon" style={{ background: olimpiada.corDestaque || 'var(--olive-500)' }}>
          {olimpiada.sigla?.slice(0, 3).toUpperCase()}
        </div>
      )}

      <div className="oly-card-body">
        <div className="oly-card-title">{olimpiada.sigla} - {olimpiada.nome}</div>
        <div className="oly-card-stage">
          {stage}
          {olimpiada.edicaoAtual && ` - ${olimpiada.edicaoAtual.ano}`}
        </div>
      </div>

      <div className="oly-card-side">
        {prazo?.diasRestantes != null && (
          <div className="oly-card-days" style={{ color: urgencyColor(prazo.diasRestantes) }}>
            <Clock size={12} />
            {prazo.diasRestantes} dias
          </div>
        )}
        <span
          role="button"
          tabIndex={0}
          className={`oly-card-fav ${olimpiada.favoritado ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito?.(olimpiada.id);
          }}
        >
          <Heart size={16} fill={olimpiada.favoritado ? 'currentColor' : 'none'} />
        </span>
      </div>
    </button>
  );
}
