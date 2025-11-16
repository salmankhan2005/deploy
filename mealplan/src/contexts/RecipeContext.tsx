import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/services/recipeService';

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  createRecipe: (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => Promise<Recipe>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
  getRecipe: (id: string) => Promise<Recipe | null>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const recipeHook = useRecipes();

  const memoizedValue = useMemo(() => ({
    ...recipeHook,
    recipes: recipeHook.recipes || []
  }), [
    recipeHook.recipes,
    recipeHook.loading,
    recipeHook.error,
    recipeHook.fetchRecipes,
    recipeHook.createRecipe,
    recipeHook.updateRecipe,
    recipeHook.deleteRecipe,
    recipeHook.getRecipe
  ]);

  return (
    <RecipeContext.Provider value={memoizedValue}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};