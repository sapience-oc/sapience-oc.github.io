// -----------------------------------------------------------------------
// Ponte com o MIT App Inventor / CustomWebView.
//
// PROBLEMA: <input type="file"> depende do WebView implementar
// `onShowFileChooser` (WebChromeClient) pra abrir o seletor de arquivos.
// A maioria dos componentes CustomWebView (inclusive o do App Inventor)
// NAO implementa isso, entao clicar no input simplesmente nao faz nada -
// nao ha solucao 100% do lado do site pra isso.
//
// SOLUCAO: usar um componente NATIVO pra escolher/tirar a foto (ex:
// Camera ou ImagePicker do App Inventor) e mandar o resultado pro site
// via JavaScript, chamando uma funcao que o site expoe em `window`.
//
// Como usar nos Blocks do App Inventor:
//   1) Apos o usuario escolher a imagem (bloco "after picking"/"after
//      taking picture"), converta o arquivo pra base64 (ex: com a
//      extensao "File" ou "Taifun File", que tem um bloco tipo
//      "Base64Encode" a partir de um caminho de arquivo).
//   2) Chame:
//        CustomWebView1.RunJavaScript(
//          "window.SapienceNative && window.SapienceNative.setAvatar('data:image/jpeg;base64," + base64 + "')"
//        )
//
// O site escuta isso e atualiza o avatar automaticamente, em qualquer
// tela que esteja com o editor de foto aberto.
// -----------------------------------------------------------------------

const EVENT_NAME = 'sapience:native-avatar';

export function initNativeBridge() {
  if (typeof window === 'undefined') return;
  if (window.SapienceNative) return; // ja inicializado

  window.SapienceNative = {
    // Chamado pelo lado nativo (App Inventor) com uma data URL
    // (ex: "data:image/jpeg;base64,...") ou uma URL http(s) ja hospedada.
    setAvatar(dataUrlOuUrl) {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dataUrlOuUrl }));
    },
  };
}

// Hook simples: chama `onAvatar(dataUrl)` sempre que o nativo mandar uma
// foto nova. Retorna a funcao de cleanup (remover o listener).
export function onNativeAvatar(onAvatar) {
  initNativeBridge();
  function handler(e) {
    onAvatar(e.detail);
  }
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Deteccao simples de que o site esta rodando dentro do CustomWebView do
// App Inventor (o proprio componente injeta um user agent com "AppInventor"
// ou similar em alguns casos; na duvida, usamos como pista opcional e nao
// bloqueamos nada com base nisso — o input de arquivo continua disponivel
// como fallback pra quando o site abre num navegador normal).
export function isProvavelmenteWebViewNativo() {
  if (typeof navigator === 'undefined') return false;
  return /wv|AppInventor|Kodular/i.test(navigator.userAgent || '');
}