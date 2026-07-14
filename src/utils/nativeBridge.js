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
  if (window.SapienceNative) return;

  window.SapienceNative = {
    setAvatar(dataUrlOuUrl) {
      window.dispatchEvent(new CustomEvent('sapience:native-avatar', { detail: dataUrlOuUrl }));
    },
    async uploadAvatar(base64Puro) {
      try {
        const { uploadAvatarBase64 } = await import('../api/usuario.js');
        const resultado = await uploadAvatarBase64(base64Puro);
        window.dispatchEvent(new CustomEvent('sapience:native-avatar', { detail: resultado.avatar }));
      } catch (err) {
        console.error('[SapienceNative] Erro no upload do avatar:', err);
        window.dispatchEvent(new CustomEvent('sapience:native-avatar-error', { detail: err.message }));
      }
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