import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

interface Recipe {
  id: number | string;
  name: string;
  time: string;
  servings: number;
  image: string;
  ingredients?: string[];
  instructions?: string[];
}

interface SavedRecipesContextType {
  savedRecipes: Recipe[];
  createdRecipes: Recipe[];
  saveRecipe: (recipe: Recipe) => void;
  unsaveRecipe: (recipeId: number | string) => void;
  isRecipeSaved: (recipeId: number | string) => boolean;
  createRecipe: (recipe: Recipe) => Promise<void>;
  deleteCreatedRecipe: (recipeId: number | string) => void;
  isLoading: boolean;
}

const SavedRecipesContext = createContext<SavedRecipesContextType | undefined>(undefined);

export const SavedRecipesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);

  // Fetch recipes from API
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecipes();
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem('savedRecipes');
      const created = localStorage.getItem('createdRecipes');
      setSavedRecipes(saved ? JSON.parse(saved) : []);
      setCreatedRecipes(created ? JSON.parse(created) : []);
    }
  }, [isAuthenticated]);

  // Save to localStorage for guest mode
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      localStorage.setItem('createdRecipes', JSON.stringify(createdRecipes));
    }
  }, [savedRecipes, createdRecipes, isGuest]);
  const fetchRecipes = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // First check if backend is available
      const isHealthy = await apiService.checkHealth();
      if (!isHealthy) {
        console.warn('Backend unavailable, loading recipes from local storage');
        const created = localStorage.getItem('createdRecipes');
        const saved = localStorage.getItem('savedRecipes');
        setCreatedRecipes(created ? JSON.parse(created) : []);
        setSavedRecipes(saved ? JSON.parse(saved) : []);
        return;
      }
      
      // Fetch created recipes
      const createdResponse = await apiService.getRecipes();
      if (createdResponse && createdResponse.recipes) {
        setCreatedRecipes(createdResponse.recipes as Recipe[]);
        localStorage.setItem('createdRecipes', JSON.stringify(createdResponse.recipes));
      }
      
      // Fetch saved recipes
      const savedResponse = await fetch(`${API_BASE_URL}/user-recipes`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        const savedRecipes = savedData.saved_recipes?.map((item: any) => item.recipes) || [];
        setSavedRecipes(savedRecipes);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      }
      
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      // Try to load from localStorage as fallback
      const created = localStorage.getItem('createdRecipes');
      const saved = localStorage.getItem('savedRecipes');
      if (created || saved) {
        setCreatedRecipes(created ? JSON.parse(created) : []);
        setSavedRecipes(saved ? JSON.parse(saved) : []);
        toast.info('Using locally cached recipes - some changes may not be saved');
      } else {
        toast.error('Failed to load your recipes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (isAuthenticated) {
      // For authenticated users, save to user_recipes table
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            recipe_data: recipe
          })
        });
        
        if (response.ok) {
          setSavedRecipes(prev => {
            if (prev.find(r => r.id === recipe.id)) {
              return prev;
            }
            return [...prev, recipe];
          });
          toast.success('Recipe saved to your account');
        } else {
          throw new Error('Failed to save recipe');
        }
      } catch (error) {
        // Fallback to localStorage
        setSavedRecipes(prev => {
          if (prev.find(r => r.id === recipe.id)) {
            return prev;
          }
          return [...prev, recipe];
        });
        toast.info('Recipe saved locally');
      }
    } else {
      // For guests, save to localStorage
      setSavedRecipes(prev => {
        if (prev.find(r => r.id === recipe.id)) {
          return prev;
        }
        return [...prev, recipe];
      });
    }
  };

  const unsaveRecipe = async (recipeId: number | string) => {
    // Check if it's a created recipe (can't unsave created recipes, only delete them)
    const isCreatedRecipe = createdRecipes.some(r => r.id.toString() === recipeId.toString());
    if (isCreatedRecipe) {
      toast.info('This is your created recipe. Use delete option to remove it.');
      return;
    }
    
    if (isAuthenticated) {
      // For authenticated users, remove from user_recipes table
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/save`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (response.ok) {
          setSavedRecipes(prev => prev.filter(r => r.id.toString() !== recipeId.toString()));
          toast.success('Recipe removed');
        } else {
          throw new Error('Failed to remove recipe');
        }
      } catch (error) {
        // Fallback to localStorage
        setSavedRecipes(prev => prev.filter(r => r.id.toString() !== recipeId.toString()));
        toast.info('Recipe removed locally');
      }
    } else {
      // For guests, remove from localStorage
      setSavedRecipes(prev => prev.filter(r => r.id.toString() !== recipeId.toString()));
    }
  };

  const isRecipeSaved = (recipeId: number | string) => {
    // Check if it's in saved recipes
    const inSaved = savedRecipes.some(r => r.id.toString() === recipeId.toString());
    // Check if it's a created recipe (created recipes are automatically "saved")
    const inCreated = createdRecipes.some(r => r.id.toString() === recipeId.toString());
    return inSaved || inCreated;
  };

  const createRecipe = async (recipe: Recipe) => {
    if (isGuest) {
      // For guests, just add to local state with a generated ID
      const newRecipe = {...recipe, id: Date.now()};
      setCreatedRecipes(prev => [...prev, newRecipe]);
      toast.success('Recipe saved locally (guest mode)');
      return Promise.resolve();
    }
    
    if (!isAuthenticated) {
      // Handle case where user is neither authenticated nor in guest mode
      toast.error('Please sign in to save recipes');
      return Promise.reject(new Error('Authentication required'));
    }
    
    // For authenticated users, try to save to database
    setIsLoading(true);
    try {
      // First check if backend is available
      const isHealthy = await apiService.checkHealth();
      if (!isHealthy) {
        // If backend is unavailable, save locally with temporary ID
        const tempRecipe = { ...recipe, id: `temp_${Date.now()}` };
        setCreatedRecipes(prev => [...prev, tempRecipe]);
        localStorage.setItem('createdRecipes', JSON.stringify([...createdRecipes, tempRecipe]));
        toast.info('Saved recipe locally. Will sync when connection is restored.');
        setIsLoading(false);
        return Promise.resolve();
      }
      
      const response = await apiService.createRecipe(recipe);
      if (response && response.recipe) {
        setCreatedRecipes(prev => [...prev, response.recipe]);
        // Also save to localStorage as backup
        localStorage.setItem('createdRecipes', JSON.stringify([...createdRecipes, response.recipe]));
        toast.success('Recipe saved to your account');
      }
    } catch (error) {
      console.error('Failed to create recipe:', error);
      // Save locally as fallback with temporary ID
      const tempRecipe = { ...recipe, id: `temp_${Date.now()}` };
      setCreatedRecipes(prev => [...prev, tempRecipe]);
      localStorage.setItem('createdRecipes', JSON.stringify([...createdRecipes, tempRecipe]));
      toast.info('Saved recipe locally. Will sync when connection is restored.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCreatedRecipe = async (recipeId: number | string) => {
    if (isGuest) {
      // For guests, remove from localStorage
      setCreatedRecipes(prev => prev.filter(r => r.id !== recipeId));
      return;
    }
    
    // For authenticated users, try to delete from database
    setIsLoading(true);
    
    try {
      // First check if backend is available
      const isHealthy = await apiService.checkHealth();
      
      // Remove from local state immediately for better UX
      setCreatedRecipes(prev => {
        const updated = prev.filter(r => r.id !== recipeId);
        localStorage.setItem('createdRecipes', JSON.stringify(updated));
        return updated;
      });
      
      if (!isHealthy || String(recipeId).startsWith('temp_')) {
        // If backend is unavailable or it's a temporary recipe, just remove locally
        toast.success('Recipe deleted locally');
        setIsLoading(false);
        return;
      }
      
      // Try to delete from backend
      await apiService.deleteRecipe(recipeId);
      toast.success('Recipe deleted');
    } catch (error) {
      console.error('Failed to delete recipe from server:', error);
      toast.info('Recipe deleted locally. Server sync failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SavedRecipesContext.Provider value={{ 
      savedRecipes, 
      createdRecipes,
      saveRecipe, 
      unsaveRecipe, 
      isRecipeSaved,
      createRecipe,
      deleteCreatedRecipe,
      isLoading
    }}>
      {children}
    </SavedRecipesContext.Provider>
  );
};

export const useSavedRecipes = () => {
  const context = useContext(SavedRecipesContext);
  if (context === undefined) {
    throw new Error('useSavedRecipes must be used within a SavedRecipesProvider');
  }
  return context;
};
