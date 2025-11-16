import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface TourContextType {
  showTour: boolean;
  startTour: () => void;
  completeTour: () => void;
  shouldShowTour: () => boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTour, setShowTour] = useState(false);
  const { user, isGuest, isAuthenticated } = useAuth();

  const getTourKey = () => {
    if (isAuthenticated && user?.id) {
      return `genie-tour-completed-${user.id}`;
    }
    return 'genie-tour-completed-guest';
  };

  const shouldShowTour = () => {
    const tourKey = getTourKey();
    const tourCompleted = localStorage.getItem(tourKey);
    return !tourCompleted;
  };

  const startTour = () => {
    if (shouldShowTour()) {
      setShowTour(true);
    }
  };

  const completeTour = () => {
    setShowTour(false);
    const tourKey = getTourKey();
    localStorage.setItem(tourKey, 'true');
  };

  useEffect(() => {
    // Auto-start tour for new users/guests after auth state is determined
    if (isAuthenticated !== undefined) {
      const timer = setTimeout(() => {
        if (shouldShowTour()) {
          startTour();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, isGuest]);

  // Also trigger tour when user state changes (login/guest mode)
  useEffect(() => {
    if ((isAuthenticated || isGuest) && shouldShowTour()) {
      const timer = setTimeout(() => {
        startTour();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isGuest, user?.id]);

  return (
    <TourContext.Provider value={{ showTour, startTour, completeTour, shouldShowTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};