export function openExternal(url) {
  if (!url) return;

  const bridge = typeof window !== 'undefined' && window.AppInventor;
  if (bridge && typeof bridge.setWebViewString === 'function') {
    bridge.setWebViewString(url);
    return;
  }

  window.location.href = url;
}