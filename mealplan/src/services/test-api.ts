// Test if we can reach the Flask server
export const testConnection = async (): Promise<boolean> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
    const response = await fetch(`${apiUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
};