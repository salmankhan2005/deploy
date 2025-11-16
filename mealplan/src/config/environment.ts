/**
 * Environment configuration with secure defaults
 */

interface EnvironmentConfig {
  apiUrl: string;
  adminApiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  enableLogging: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  return {
    apiUrl: import.meta.env.VITE_API_URL || (isDevelopment ? 'http://127.0.0.1:5000/api' : '/api'),
    adminApiUrl: import.meta.env.VITE_ADMIN_API_URL || (isDevelopment ? 'http://127.0.0.1:5001/api' : '/admin-api'),
    isDevelopment,
    isProduction,
    enableLogging: isDevelopment || import.meta.env.VITE_ENABLE_LOGGING === 'true'
  };
};

export const config = getEnvironmentConfig();

// Validate required environment variables
if (!config.apiUrl) {
  throw new Error('API URL is required but not configured');
}

export default config;