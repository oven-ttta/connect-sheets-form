// Configuration for API and file URLs
export const API_BASE_URL = 'http://192.168.1.237:3001';
export const FILE_BASE_URL = 'http://192.168.1.237:3001';

// Helper function to get full file URL
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path; // Already full URL
  return `${FILE_BASE_URL}${path}`;
};
