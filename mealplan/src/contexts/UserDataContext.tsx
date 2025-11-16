import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Person {
  id: string | number;
  name: string;
  preferences?: string;
  allergies?: string;
}

interface UserPreferences {
  selectedWeek: string;
  viewMode: 'list' | 'calendar';
}

interface UserDataContextType {
  people: Person[];
  preferences: UserPreferences;
  loading: boolean;
  addPerson: (person: Omit<Person, 'id'>) => Promise<void>;
  updatePerson: (id: string | number, data: Partial<Person>) => Promise<void>;
  deletePerson: (id: string | number) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    selectedWeek: 'Week - 1',
    viewMode: 'list'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    } else if (isGuest) {
      loadGuestData();
    }
  }, [isAuthenticated, isGuest]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Check if backend is available first
      await apiService.checkHealth();
      
      // Load people
      try {
        const peopleResponse = await apiService.getPersons();
        setPeople(peopleResponse.persons || []);
      } catch (error) {
        console.warn('People API not available, using defaults');
        setPeople([
          { id: 'default-1', name: 'Person A', preferences: '', allergies: '' },
          { id: 'default-2', name: 'Person B', preferences: '', allergies: '' }
        ]);
      }

      // Load preferences
      try {
        const prefsResponse = await apiService.getPreferences();
        setPreferences({
          selectedWeek: prefsResponse.preferences.selected_week || 'Week - 1',
          viewMode: prefsResponse.preferences.view_mode || 'list'
        });
      } catch (error) {
        console.warn('Preferences API not available, using defaults');
        setPreferences({ selectedWeek: 'Week - 1', viewMode: 'list' });
      }
    } catch (error) {
      console.error('Backend not available, using guest data:', error);
      loadGuestData();
    } finally {
      setLoading(false);
    }
  };

  const loadGuestData = () => {
    // Load from localStorage for guests
    const savedPeople = localStorage.getItem('guest_people');
    const savedPrefs = localStorage.getItem('guest_preferences');

    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    } else {
      setPeople([
        { id: 'guest-1', name: 'Person A', preferences: '', allergies: '' },
        { id: 'guest-2', name: 'Person B', preferences: '', allergies: '' }
      ]);
    }

    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  };

  const saveGuestData = (newPeople?: Person[], newPrefs?: UserPreferences) => {
    if (newPeople) {
      localStorage.setItem('guest_people', JSON.stringify(newPeople));
    }
    if (newPrefs) {
      localStorage.setItem('guest_preferences', JSON.stringify(newPrefs));
    }
  };

  const addPerson = async (personData: Omit<Person, 'id'>) => {
    if (isAuthenticated) {
      try {
        const response = await apiService.addPerson(personData);
        await refreshData();
      } catch (error) {
        console.warn('Failed to add person to backend, adding locally');
        const newPerson: Person = {
          ...personData,
          id: `local-${Date.now()}`
        };
        const newPeople = [...people, newPerson];
        setPeople(newPeople);
      }
    } else {
      const newPerson: Person = {
        ...personData,
        id: `guest-${Date.now()}`
      };
      const newPeople = [...people, newPerson];
      setPeople(newPeople);
      saveGuestData(newPeople);
    }
  };

  const updatePerson = async (id: string | number, data: Partial<Person>) => {
    if (isAuthenticated && typeof id === 'string') {
      await apiService.updatePerson(id, data);
      await loadUserData();
    } else {
      const newPeople = people.map(p => p.id === id ? { ...p, ...data } : p);
      setPeople(newPeople);
      saveGuestData(newPeople);
    }
  };

  const deletePerson = async (id: string | number) => {
    if (isAuthenticated && typeof id === 'string') {
      await apiService.deletePerson(id);
      await loadUserData();
    } else {
      const newPeople = people.filter(p => p.id !== id);
      setPeople(newPeople);
      saveGuestData(newPeople);
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...prefs };
    setPreferences(newPrefs);

    if (isAuthenticated) {
      try {
        await apiService.updatePreferences({
          selected_week: newPrefs.selectedWeek,
          view_mode: newPrefs.viewMode
        });
      } catch (error) {
        console.warn('Failed to save preferences to backend:', error);
      }
    } else {
      saveGuestData(undefined, newPrefs);
    }
  };

  const refreshData = async () => {
    if (isAuthenticated) {
      await loadUserData();
    } else {
      loadGuestData();
    }
  };

  return (
    <UserDataContext.Provider value={{
      people,
      preferences,
      loading,
      addPerson,
      updatePerson,
      deletePerson,
      updatePreferences,
      refreshData
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};