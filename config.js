// Configuration for API and file URLs
const API_HOST = 'api-yec.over24h.shop';
export const API_BASE_URL = `https://${API_HOST}`;
export const FILE_BASE_URL = `https://${API_HOST}`;

// Helper function to get full file URL
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path; 
  return `${FILE_BASE_URL}${path}`;
};
