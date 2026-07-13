const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getImageUrl(imagePath, forceRefresh = false) {
  if (!imagePath) return null;

  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  if (forceRefresh) {
    return `${baseUrl}${path}?t=${Date.now()}`;
  }
  
  return `${baseUrl}${path}`;
}