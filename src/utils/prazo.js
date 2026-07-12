/**
 * O back manda `diasRestantes` podendo vir negativo quando o prazo ja
 * passou (ex: -1 = venceu ontem). Antes o front fazia Math.max(dias, 0)
 * pra nao mostrar numero negativo, mas isso fazia o card ficar preso
 * mostrando "0 dias" pra sempre depois que o prazo vencia.
 *
 * A partir de 1 dia apos o prazo (diasRestantes < 0), tratamos como se
 * a olimpiada nao tivesse mais prazo em aberto (proximoPrazo = null).
 * No dia exato do prazo (diasRestantes === 0) ele ainda conta como
 * valido - hoje ainda da pra cumprir.
 */
export function prazoAtivo(proximoPrazo) {
  if (!proximoPrazo) return null;
  if (proximoPrazo.diasRestantes == null) return proximoPrazo;
  return proximoPrazo.diasRestantes >= 0 ? proximoPrazo : null;
}
