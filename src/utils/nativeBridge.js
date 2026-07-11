const EVENT_NAME = 'sapience:native-avatar';

export function requestNativeGalleryPick() {
  try {
    if (window.AppInventor?.setWebViewString) {
      window.AppInventor.setWebViewString('sapience:pick-avatar');
      return true;
    }
  } catch {
    /* none */
  }
  return false;
}

export function initNativeBridge() {
  if (typeof window === 'undefined') return;
  if (window.SapienceNative) return; // ja inicializado

  window.SapienceNative = {
    setAvatar(dataUrlOuUrl) {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dataUrlOuUrl }));
    },
  };
}

export function onNativeAvatar(onAvatar) {
  initNativeBridge();
  function handler(e) {
    onAvatar(e.detail);
  }
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export function isProvavelmenteWebViewNativo() {
  if (typeof navigator === 'undefined') return false;
  return /wv|AppInventor|Kodular/i.test(navigator.userAgent || '');
}