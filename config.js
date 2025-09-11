// Configuration for API and file URLs
const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER === 'true';
const API_HOST = isDocker ? 'localhost' : '192.168.1.237';
const API_PORT = '3001';

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;
export const FILE_BASE_URL = `http://${API_HOST}:${API_PORT}`;

// Helper function to get full file URL
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path; // Already full URL
  return `${FILE_BASE_URL}${path}`;
};
