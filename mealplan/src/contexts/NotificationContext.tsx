import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SupportNotification {
  id: number;
  title: string;
  message: string;
  type: 'announcement' | 'maintenance' | 'update';
  date: string;
  read: boolean;
}

interface EmailSettings {
  newsletter: boolean;
  supportNotifications: boolean;
  recipeUpdates: boolean;
  mealReminders: boolean;
}

interface NotificationContextType {
  supportNotifications: SupportNotification[];
  emailSettings: EmailSettings;
  markAsRead: (id: number) => void;
  updateEmailSettings: (settings: Partial<EmailSettings>) => void;
  addSupportNotification: (notification: Omit<SupportNotification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [supportNotifications, setSupportNotifications] = useState<SupportNotification[]>([
    {
      id: 1,
      title: 'New Recipe Categories Added!',
      message: 'We\'ve added new recipe categories including Mediterranean and Asian cuisine.',
      type: 'announcement',
      date: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for tonight 2-4 AM EST. App may be temporarily unavailable.',
      type: 'maintenance',
      date: new Date(Date.now() - 86400000).toISOString(),
      read: false
    }
  ]);

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    newsletter: true,
    supportNotifications: true,
    recipeUpdates: false,
    mealReminders: true
  });

  const markAsRead = (id: number) => {
    setSupportNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const updateEmailSettings = (settings: Partial<EmailSettings>) => {
    setEmailSettings(prev => ({ ...prev, ...settings }));
  };

  const addSupportNotification = (notification: Omit<SupportNotification, 'id' | 'read'>) => {
    const newNotification: SupportNotification = {
      ...notification,
      id: Date.now(),
      read: false
    };
    setSupportNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      supportNotifications,
      emailSettings,
      markAsRead,
      updateEmailSettings,
      addSupportNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};