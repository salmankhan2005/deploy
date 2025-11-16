/**
 * Security utilities for input validation and sanitization
 */

// XSS Protection - Sanitize HTML content
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Input validation
export const validateInput = (input: string, maxLength: number = 255): boolean => {
  if (!input || typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  // Check for malicious patterns
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i
  ];
  return !maliciousPatterns.some(pattern => pattern.test(input));
};

// Log injection prevention
export const sanitizeLogData = (data: any): string => {
  if (typeof data === 'string') {
    return data.replace(/[\r\n\t]/g, ' ').substring(0, 500);
  }
  return JSON.stringify(data).replace(/[\r\n\t]/g, ' ').substring(0, 500);
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure headers for API requests
export const getSecureHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};