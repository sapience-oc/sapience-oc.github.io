import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, ChevronRight as ArrowRight } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import { listCalendarEvents } from '../api/olimpiadas';
import { parseDataLocal, formatarDataLonga, formatarPeriodoPrazo, listarDiasEntre } from '../utils/date';
import './Calendar.css';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

function buildMonthGrid(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const hoje = new Date();
  const [year, setYear] = useState(hoje.getFullYear());
  const [monthIndex, setMonthIndex] = useState(hoje.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErro(null);
    listCalendarEvents()
      .then((data) => {
        if (ativo) setEvents(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar calendário:', err);
        if (ativo) setErro('Nao foi possivel carregar o calendário agora.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const cells = useMemo(() => buildMonthGrid(year, monthIndex), [year, monthIndex]);

  const eventosDoMes = useMemo(() => {
    const primeiroDiaDoMes = new Date(year, monthIndex, 1);
    const ultimoDiaDoMes = new Date(year, monthIndex + 1, 0);

    return events
      .filter((e) => {
        const inicio = parseDataLocal(e.data);
        const fim = e.dataFim ? parseDataLocal(e.dataFim) : inicio;
        return inicio <= ultimoDiaDoMes && fim >= primeiroDiaDoMes;
      })
      .sort((a, b) => parseDataLocal(a.data) - parseDataLocal(b.data));
  }, [events, year, monthIndex]);

  const { eventosPorDia, diasComMarcador, diasEmIntervalo } = useMemo(() => {
    const porDia = new Map();
    const comMarcador = new Set();
    const emIntervalo = new Set();

    eventosDoMes.forEach((e) => {
      const diasDoIntervalo = listarDiasEntre(e.data, e.dataFim);
      const duracaoDias = diasDoIntervalo.length - 1;
      const intervaloLongo = duracaoDias > 7;

      diasDoIntervalo.forEach((dataObj, idx) => {
        if (dataObj.getFullYear() !== year || dataObj.getMonth() !== monthIndex) return;
        const dia = dataObj.getDate();
        const ehInicioOuFim = idx === 0 || idx === diasDoIntervalo.length - 1;

        if (intervaloLongo && !ehInicioOuFim) return;

        if (!porDia.has(dia)) porDia.set(dia, []);
        porDia.get(dia).push(e);

        if (ehInicioOuFim) {
          comMarcador.add(dia);
        } else {
          emIntervalo.add(dia);
        }
      });
    });

    return { eventosPorDia: porDia, diasComMarcador: comMarcador, diasEmIntervalo: emIntervalo };
  }, [eventosDoMes, year, monthIndex]);

  function changeMonth(delta) {
    let newMonth = monthIndex + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonthIndex(newMonth);
    setYear(newYear);
  }

  const eventosDoDiaSelecionado = selectedDay ? eventosPorDia.get(selectedDay) || [] : [];

  return (
    <>
      <GradientSheet
        maxHeight={130}
        minHeight={78}
        headerContent={
          <div>
            <p className="cal-eyebrow">Calendário</p>
            <h1 className="cal-title">de olimpiadas</h1>
          </div>
        }
      >
        <div className="overlap-card cal-card">
          <div className="cal-nav">
            <button onClick={() => changeMonth(-1)} aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
            <span>
              {MONTHS[monthIndex]} <strong>{year}</strong>
            </span>
            <button onClick={() => changeMonth(1)} aria-label="Proximo mes">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="cal-weekdays">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          <div className="cal-grid">
            {cells.map((day, idx) => {
              const temEvento = day && eventosPorDia.has(day);
              const classes = ['cal-cell'];
              if (!day) classes.push('empty');
              if (day && diasComMarcador.has(day)) classes.push('has-event');
              if (day && diasEmIntervalo.has(day)) classes.push('in-range');
              return (
                <button
                  key={idx}
                  className={classes.join(' ')}
                  disabled={!temEvento}
                  onClick={() => setSelectedDay(day)}
                >
                  {day || ''}
                </button>
              );
            })}
          </div>

          <div className="cal-legend">
            <span className="cal-legend-item">
              <span className="cal-legend-dot solid" /> Prazo / inicio-fim
            </span>
            <span className="cal-legend-item">
              <span className="cal-legend-dot range" /> Dentro do intervalo
            </span>
          </div>
        </div>

        <p className="cal-hint">Mostrando prazos das suas olimpíadas favoritas. Toque em um dia marcado pra ver os detalhes.</p>

        <div className="cal-events">
          {loading && <p className="muted-text">Carregando...</p>}
          {!loading && erro && <p className="muted-text">{erro}</p>}
          {!loading && !erro && eventosDoMes.length === 0 && (
            <p className="muted-text">Nenhum prazo nesse mês para suas olimpíadas favoritas.</p>
          )}
          {eventosDoMes.map((e) => (
            <button key={e.id} className="cal-event" onClick={() => navigate(`/olimpiada/${e.olimpiadaId}`)}>
              <Bell size={16} color="var(--gold)" />
              <div>
                <div className="cal-event-title">{e.titulo}</div>
                <div className="cal-event-note">
                  {e.nota} - {formatarPeriodoPrazo(e)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </GradientSheet>
      <BottomNav />

      <Modal
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? formatarDataLonga(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`) : ''}
      >
        <div className="day-modal-list">
          {eventosDoDiaSelecionado.map((e) => (
            <button
              key={e.id}
              className="day-modal-item"
              onClick={() => {
                setSelectedDay(null);
                navigate(`/olimpiada/${e.olimpiadaId}`);
              }}
            >
              <div className="day-modal-badge">{e.tipoPrazo?.nome || e.nome}</div>
              <div className="day-modal-body">
                <div className="day-modal-event">{e.nome}</div>
                <div className="day-modal-periodo">{formatarPeriodoPrazo(e)}</div>
                <div className="day-modal-olympiad">
                  {e.olimpiadaSigla} - {e.olimpiadaNome} ({e.edicaoAno})
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-secondary)" />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}