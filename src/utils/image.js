const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://srv1826188.hstgr.cloud';

export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    if (imagePath.includes('sapience-oc.github.io/media')) {
      return imagePath.replace('https://sapience-oc.github.io', API_BASE_URL);
    }
    return imagePath;
  }

  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${path}`;
}