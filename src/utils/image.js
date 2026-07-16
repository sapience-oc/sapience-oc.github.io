const API_BASE_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, ''); 
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${path}`;
}