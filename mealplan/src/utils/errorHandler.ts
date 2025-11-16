/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  static handleApiError(error: any): AppError {
    // Don't expose sensitive error details
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        statusCode: 0,
        isOperational: true
      };
    }

    if (error.status === 401) {
      return {
        message: 'Authentication required. Please sign in again.',
        code: 'AUTH_ERROR',
        statusCode: 401,
        isOperational: true
      };
    }

    if (error.status === 403) {
      return {
        message: 'Access denied. You do not have permission for this action.',
        code: 'PERMISSION_ERROR',
        statusCode: 403,
        isOperational: true
      };
    }

    if (error.status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        statusCode: error.status,
        isOperational: true
      };
    }

    // Generic error for unknown cases
    return {
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      statusCode: error.status || 500,
      isOperational: true
    };
  }

  static logError(error: AppError, context?: string): void {
    // Safe logging without exposing sensitive data
    const logData = {
      timestamp: new Date().toISOString(),
      code: error.code,
      statusCode: error.statusCode,
      context: context || 'unknown',
      // Don't log full error message to prevent log injection
      hasError: true
    };
    
    console.error('Application Error:', logData);
  }

  static handleAsyncError<T>(
    asyncFn: () => Promise<T>,
    fallbackValue: T,
    context?: string
  ): Promise<T> {
    return asyncFn().catch((error) => {
      const appError = this.handleApiError(error);
      this.logError(appError, context);
      return fallbackValue;
    });
  }
}