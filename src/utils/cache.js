/**
 * Cache simples no localStorage, com expiracao (TTL) por chave.
 *
 * Existe pra reduzir chamadas desnecessarias na API (que roda em hospedagem
 * gratuita, entao cada requisicao "a toa" custa latencia real pro usuario).
 *
 * Estrategia "stale-while-revalidate":
 *  - cache fresco (dentro do TTL)  -> devolve na hora, ZERO requisicao.
 *  - cache velho (passou do TTL)   -> devolve o que tem na hora (a tela nao
 *    fica esperando), e dispara uma atualizacao em segundo plano pra proxima
 *    vez que a tela for aberta ja vir com o dado novo.
 *  - sem cache nenhum              -> busca normalmente e guarda.
 *
 * Isso significa que, quando o cache esta "velho", a tela atual ainda mostra
 * o valor antigo (nao fica reativa a atualizacao em segundo plano). Se um dia
 * quiser isso reativo, da pra evoluir emitindo um evento quando o refresh
 * terminar e os componentes assinarem esse evento.
 */

const PREFIX = 'sapience_cache:';

export function getCached(chave, maxAgeMs) {
  try {
    const bruto = localStorage.getItem(PREFIX + chave);
    if (!bruto) return null;
    const { valor, timestamp } = JSON.parse(bruto);
    const idade = Date.now() - timestamp;
    return { valor, expirado: idade > maxAgeMs };
  } catch {
    return null;
  }
}

export function setCached(chave, valor) {
  try {
    localStorage.setItem(PREFIX + chave, JSON.stringify({ valor, timestamp: Date.now() }));
  } catch {
    // localStorage cheio/indisponivel (ex: modo privado) - ignora, so nao cacheia.
  }
}

export function invalidateCached(chave) {
  try {
    localStorage.removeItem(PREFIX + chave);
  } catch {
    /* noop */
  }
}

export function clearAllCached() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}

/**
 * Envolve uma funcao assincrona de busca (ex: () => request('/usuarios/me'))
 * com a estrategia de cache acima.
 */
export async function comCache(chave, maxAgeMs, buscar) {
  const cache = getCached(chave, maxAgeMs);

  if (cache && !cache.expirado) {
    return cache.valor;
  }

  if (cache && cache.expirado) {
    // devolve o velho na hora, atualiza em segundo plano pra proxima visita
    buscar()
      .then((novo) => setCached(chave, novo))
      .catch(() => {
        /* falhou a atualizacao em segundo plano - mantem o cache antigo, sem erro visivel */
      });
    return cache.valor;
  }

  const valor = await buscar();
  setCached(chave, valor);
  return valor;
}
