export function parseDataLocal(iso) {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00`);
}

export function formatarDataCurta(iso) {
  const d = parseDataLocal(iso);
  if (!d) return '-';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function formatarDataLonga(iso) {
  const d = parseDataLocal(iso);
  if (!d) return '-';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function formatarPeriodoPrazo(prazo) {
  if (!prazo?.data) return '-';
  if (!prazo.dataFim || prazo.dataFim === prazo.data) {
    return formatarDataLonga(prazo.data);
  }

  const inicio = parseDataLocal(prazo.data);
  const fim = parseDataLocal(prazo.dataFim);
  const mesmoMesEAno = inicio.getMonth() === fim.getMonth() && inicio.getFullYear() === fim.getFullYear();

  if (mesmoMesEAno) {
    const diaInicio = inicio.toLocaleDateString('pt-BR', { day: '2-digit' });
    return `${diaInicio} a ${formatarDataLonga(prazo.dataFim)}`;
  }

  return `${formatarDataLonga(prazo.data)} a ${formatarDataLonga(prazo.dataFim)}`;
}

export function formatarPeriodoPrazoCurto(prazo) {
  if (!prazo?.data) return '-';
  if (!prazo.dataFim || prazo.dataFim === prazo.data) {
    return formatarDataCurta(prazo.data);
  }
  const inicio = parseDataLocal(prazo.data);
  const fim = parseDataLocal(prazo.dataFim);
  const mesmoMes = inicio.getMonth() === fim.getMonth() && inicio.getFullYear() === fim.getFullYear();

  if (mesmoMes) {
    const diaInicio = inicio.toLocaleDateString('pt-BR', { day: '2-digit' });
    return `${diaInicio} a ${formatarDataCurta(prazo.dataFim)}`;
  }
  return `${formatarDataCurta(prazo.data)} a ${formatarDataCurta(prazo.dataFim)}`;
}

export function listarDiasEntre(dataInicioIso, dataFimIso) {
  const inicio = parseDataLocal(dataInicioIso);
  const fim = parseDataLocal(dataFimIso || dataInicioIso);
  const dias = [];
  const cursor = new Date(inicio);
  while (cursor <= fim) {
    dias.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}