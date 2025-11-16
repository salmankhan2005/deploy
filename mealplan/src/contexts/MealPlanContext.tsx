import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface MealPlanItem {
  id: string;
  recipeId: string | number;
  recipeName: string;
  day: string;
  mealTime: string;
  servings?: number;
  image?: string;
  time?: string;
  week?: string;
}

interface MealPlanContextType {
  mealPlan: Record<string, MealPlanItem[]>;
  currentWeek: string;
  setCurrentWeek: (week: string) => void;
  addToMealPlan: (item: Omit<MealPlanItem, 'id'>) => Promise<void>;
  removeFromMealPlan: (id: string) => Promise<void>;
  getMealsForDay: (day: string) => MealPlanItem[];
  loading: boolean;
  refreshMealPlan: () => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};

export const MealPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [mealPlan, setMealPlan] = useState<Record<string, MealPlanItem[]>>({});
  const [currentWeek, setCurrentWeek] = useState<string>('Week - 1');
  const [loading, setLoading] = useState(false);

  // Load from localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const savedMealPlan = localStorage.getItem(`guestMealPlan_${currentWeek}`);
      if (savedMealPlan) {
        try {
          setMealPlan(JSON.parse(savedMealPlan));
        } catch (error) {
          console.error('Error loading guest meal plan:', error);
        }
      } else {
        setMealPlan({});
      }
    }
  }, [isAuthenticated, currentWeek]);

  // Initialize guest data on first load
  useEffect(() => {
    if (!isAuthenticated && Object.keys(mealPlan).length === 0) {
      const savedMealPlan = localStorage.getItem(`guestMealPlan_${currentWeek}`);
      if (savedMealPlan) {
        try {
          setMealPlan(JSON.parse(savedMealPlan));
        } catch (error) {
          console.error('Error loading guest meal plan:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadMealPlan();
    }
  }, [isAuthenticated, currentWeek]);

  // Handle week changes
  useEffect(() => {
    if (isAuthenticated) {
      setMealPlan({});
      loadMealPlan();
    } else {
      // Load guest data for new week
      const savedMealPlan = localStorage.getItem(`guestMealPlan_${currentWeek}`);
      if (savedMealPlan) {
        try {
          setMealPlan(JSON.parse(savedMealPlan));
        } catch (error) {
          console.error('Error loading guest meal plan:', error);
          setMealPlan({});
        }
      } else {
        setMealPlan({});
      }
    }
  }, [currentWeek]);

  const loadMealPlan = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMealPlan(currentWeek);
      const planByDay: Record<string, MealPlanItem[]> = {};
      
      response.meal_plan.forEach((item: any) => {
        const mealItem: MealPlanItem = {
          id: item.id,
          recipeId: item.recipe_id,
          recipeName: item.recipe_name,
          day: item.day,
          mealTime: item.meal_time,
          servings: item.servings,
          image: item.image,
          time: item.time,
          week: item.week
        };
        
        if (!planByDay[item.day]) {
          planByDay[item.day] = [];
        }
        planByDay[item.day].push(mealItem);
      });
      
      setMealPlan(planByDay);
    } catch (error) {
      console.error('Failed to load meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToMealPlan = async (item: Omit<MealPlanItem, 'id'>) => {
    try {
      if (isAuthenticated) {
        await apiService.addToMealPlan({
          recipe_id: item.recipeId,
          recipe_name: item.recipeName,
          day: item.day,
          meal_time: item.mealTime,
          servings: item.servings,
          image: item.image,
          time: item.time,
          week: item.week || currentWeek
        });
        // Force reload with a small delay to ensure backend has processed
        setTimeout(() => loadMealPlan(), 100);
      } else {
        // Fallback to localStorage for guest users
        const newItem: MealPlanItem = {
          ...item,
          id: `${item.day}-${item.mealTime}-${Date.now()}`,
          week: item.week || currentWeek
        };
        const existingMeals = mealPlan[item.day] || [];
        const existingMealIndex = existingMeals.findIndex(meal => meal.mealTime === item.mealTime);
        
        let updatedDayMeals;
        if (existingMealIndex >= 0) {
          // Update existing meal
          updatedDayMeals = [...existingMeals];
          updatedDayMeals[existingMealIndex] = newItem;
        } else {
          // Add new meal
          updatedDayMeals = [...existingMeals, newItem];
        }
        
        const updatedPlan = {
          ...mealPlan,
          [item.day]: updatedDayMeals
        };
        setMealPlan(updatedPlan);
        localStorage.setItem(`guestMealPlan_${currentWeek}`, JSON.stringify(updatedPlan));
        
        // Dispatch event to notify shopping list
        window.dispatchEvent(new CustomEvent('mealsUpdated'));
      }
    } catch (error) {
      console.error('Failed to add to meal plan:', error);
      throw error;
    }
  };

  const removeFromMealPlan = async (id: string) => {
    try {
      if (isAuthenticated) {
        await apiService.removeFromMealPlan(id);
        // Force reload with a small delay to ensure backend has processed
        setTimeout(() => loadMealPlan(), 100);
      } else {
        const updatedPlan = { ...mealPlan };
        Object.keys(updatedPlan).forEach(day => {
          updatedPlan[day] = updatedPlan[day].filter(meal => meal.id !== id);
        });
        setMealPlan(updatedPlan);
        localStorage.setItem(`guestMealPlan_${currentWeek}`, JSON.stringify(updatedPlan));
        
        // Dispatch event to notify shopping list
        window.dispatchEvent(new CustomEvent('mealsUpdated'));
      }
    } catch (error) {
      console.error('Failed to remove from meal plan:', error);
      throw error;
    }
  };

  const getMealsForDay = (day: string) => {
    return mealPlan[day] || [];
  };

  return (
    <MealPlanContext.Provider value={{
      mealPlan,
      currentWeek,
      setCurrentWeek,
      addToMealPlan,
      removeFromMealPlan,
      getMealsForDay,
      loading,
      refreshMealPlan: loadMealPlan
    }}>
      {children}
    </MealPlanContext.Provider>
  );
};