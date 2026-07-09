// Le um arquivo de imagem escolhido pelo usuario, redimensiona no proprio
// navegador (canvas) para nao guardar fotos gigantescas no localStorage /
// no backend, e devolve uma data URL (base64) pronta pra usar em <img src>.
//
// Quando a API real estiver pronta, o ideal e trocar isso por um upload de
// verdade (multipart/form-data) para um endpoint tipo POST /uploads e usar
// a URL retornada — mas o redimensionamento no cliente continua sendo uma
// boa pratica antes de enviar.
export function readAndResizeImage(file, { maxSize = 400, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selecione um arquivo de imagem valido.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Nao foi possivel ler o arquivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Nao foi possivel abrir essa imagem.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
