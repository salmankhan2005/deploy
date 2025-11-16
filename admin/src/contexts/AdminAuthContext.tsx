import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApiService } from '@/services/adminApi';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (adminApiService.isAuthenticated()) {
        const response = await adminApiService.verifyToken();
        setAdmin(response.admin);
      }
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await adminApiService.login({ email, password });
    setAdmin(response.admin);
  };

  const logout = async () => {
    try {
      await adminApiService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setAdmin(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return admin?.permissions?.includes(permission) || false;
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};