import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipeContext } from '@/contexts/RecipeContext';
import { apiService } from '@/services/api';

interface Recipe {
  id: number | string;
  name: string;
  time: string;
  servings: number;
  image: string;
  ingredients?: string[];
  instructions?: string[];
}



export const useDiscoverRecipes = () => {
  const { isAuthenticated } = useAuth();
  const { recipes: userCreatedRecipes } = useRecipeContext();

  const { data: discoverRecipes = [], isLoading } = useQuery({
    queryKey: ['discoverRecipes', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated) {
        const response = await apiService.getDiscoverRecipes();
        return response.recipes;
      } else {
        try {
          const adminResponse = await apiService.getAdminRecipes();
          return adminResponse.recipes || [];
        } catch {
          return [];
        }
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const allRecipes = useMemo(() => {
    const userRecipes = userCreatedRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.title || recipe.name,
      time: recipe.cook_time ? `${recipe.cook_time} min` : '30 min',
      servings: recipe.servings || 1,
      image: '🍽️',
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    }));

    return [
      ...discoverRecipes,
      ...userRecipes
    ].filter((recipe, index, self) => 
      recipe?.name && 
      typeof recipe.name === 'string' &&
      index === self.findIndex(r => r.id === recipe.id)
    );
  }, [discoverRecipes, userCreatedRecipes]);

  return { allRecipes, loading: isLoading };
};