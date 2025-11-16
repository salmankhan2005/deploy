const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export interface Recipe {
  id?: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

class RecipeService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Local storage methods for guest users
  private getLocalRecipes(): Recipe[] {
    const recipes = localStorage.getItem('guest_recipes');
    return recipes ? JSON.parse(recipes) : [];
  }

  private saveLocalRecipes(recipes: Recipe[]): void {
    localStorage.setItem('guest_recipes', JSON.stringify(recipes));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Get all recipes
  async getRecipes(): Promise<Recipe[]> {
    if (!this.isAuthenticated()) {
      return this.getLocalRecipes();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      return data.recipes;
    } catch (error) {
      throw error;
    }
  }

  // Create new recipe
  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    if (!this.isAuthenticated()) {
      const newRecipe: Recipe = {
        ...recipe,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        image: recipe.image || '🍽️'
      };
      
      const recipes = this.getLocalRecipes();
      recipes.push(newRecipe);
      this.saveLocalRecipes(recipes);
      
      return newRecipe;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(recipe)
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      const data = await response.json();
      return data.recipe;
    } catch (error) {
      throw error;
    }
  }

  // Update recipe
  async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    if (!this.isAuthenticated()) {
      const recipes = this.getLocalRecipes();
      const index = recipes.findIndex(r => r.id === id);
      
      if (index === -1) {
        throw new Error('Recipe not found');
      }
      
      recipes[index] = {
        ...recipes[index],
        ...recipe,
        updated_at: new Date().toISOString()
      };
      
      this.saveLocalRecipes(recipes);
      return recipes[index];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(recipe)
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }

      const data = await response.json();
      return data.recipe;
    } catch (error) {
      throw error;
    }
  }

  // Delete recipe
  async deleteRecipe(id: string): Promise<void> {
    if (!this.isAuthenticated()) {
      const recipes = this.getLocalRecipes();
      const filteredRecipes = recipes.filter(r => r.id !== id);
      this.saveLocalRecipes(filteredRecipes);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
    } catch (error) {
      throw error;
    }
  }

  // Get recipe by ID
  async getRecipe(id: string): Promise<Recipe | null> {
    const recipes = await this.getRecipes();
    return recipes.find(r => r.id === id) || null;
  }

  // Track recipe access for authenticated users
  async trackRecipeAccess(recipeId: string): Promise<void> {
    if (!this.isAuthenticated()) {
      // For guest users, store in localStorage
      const accessedRecipes = JSON.parse(localStorage.getItem('guest_accessed_recipes') || '[]');
      const existingIndex = accessedRecipes.findIndex((r: any) => r.recipe_id === recipeId);
      
      if (existingIndex >= 0) {
        accessedRecipes[existingIndex].accessed_at = new Date().toISOString();
      } else {
        accessedRecipes.push({
          recipe_id: recipeId,
          accessed_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem('guest_accessed_recipes', JSON.stringify(accessedRecipes));
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/recipes/${recipeId}/access`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      // Silently fail for tracking
    }
  }

  // Get user's accessed recipes
  async getAccessedRecipes(): Promise<any[]> {
    if (!this.isAuthenticated()) {
      return JSON.parse(localStorage.getItem('guest_accessed_recipes') || '[]');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user-recipes`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accessed recipes');
      }

      const data = await response.json();
      return data.accessed_recipes;
    } catch (error) {
      return [];
    }
  }
}

export const recipeService = new RecipeService();

// Helper function to track recipe access
export const trackRecipeAccess = (recipeId: string) => {
  recipeService.trackRecipeAccess(recipeId);
};