import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, ChevronRight as ArrowRight } from 'lucide-react';
import GradientSheet from '../components/GradientSheet';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import { listCalendarEvents } from '../api/olimpiadas';
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

function formatarDataLonga(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState(2026);
  const [monthIndex, setMonthIndex] = useState(5);
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

  const eventosDoMes = useMemo(
    () =>
      events
        .filter((e) => {
          const d = new Date(e.data);
          return d.getFullYear() === year && d.getMonth() === monthIndex;
        })
        .sort((a, b) => new Date(a.data) - new Date(b.data)),
    [events, year, monthIndex]
  );

  const eventosPorDia = useMemo(() => {
    const map = new Map();
    eventosDoMes.forEach((e) => {
      const dia = new Date(e.data).getDate();
      if (!map.has(dia)) map.set(dia, []);
      map.get(dia).push(e);
    });
    return map;
  }, [eventosDoMes]);

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
              return (
                <button
                  key={idx}
                  className={`cal-cell ${day ? '' : 'empty'} ${temEvento ? 'has-event' : ''}`}
                  disabled={!temEvento}
                  onClick={() => setSelectedDay(day)}
                >
                  {day || ''}
                </button>
              );
            })}
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
                <div className="cal-event-note">{e.nota}</div>
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
