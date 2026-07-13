const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath}?t=${Date.now()}`;
}