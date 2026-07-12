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
    // none
  }
}

export function invalidateCached(chave) {
  try {
    localStorage.removeItem(PREFIX + chave);
  } catch {
    // none
  }
}

export function invalidateByPrefix(prefixoChave) {
  try {
    const alvo = PREFIX + prefixoChave;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(alvo))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // none
  }
}

export function clearAllCached() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // none
  }
}

export async function comCache(chave, maxAgeMs, buscar) {
  const cache = getCached(chave, maxAgeMs);

  if (cache && !cache.expirado) {
    return cache.valor;
  }

  if (cache && cache.expirado) {
    buscar()
      .then((novo) => setCached(chave, novo))
      .catch(() => {
        // none
      });
    return cache.valor;
  }

  const valor = await buscar();
  setCached(chave, valor);
  return valor;
}
