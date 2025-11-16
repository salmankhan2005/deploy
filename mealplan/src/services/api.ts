import { getSecureHeaders, sanitizeLogData } from '../utils/security';
import { ErrorHandler } from '../utils/errorHandler';
import { config } from '../config/environment';

const API_BASE_URL = config.apiUrl;

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

interface Recipe {
  id?: number | string;
  title?: string;
  name?: string;
  description?: string;
  time?: string;
  servings?: number;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
  prep_time?: number;
  cook_time?: number;
  difficulty?: string;
  tags?: string[];
  week?: string;
}

interface RecipeResponse {
  recipe: Recipe;
  message: string;
}

interface RecipesResponse {
  recipes: Recipe[];
  message: string;
}

class ApiService {
  private isBackendAvailable = true;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return getSecureHeaders(token || undefined);
  }

  private async cachedRequest<T>(key: string, requestFn: () => Promise<T>, ttl = 300000): Promise<T> {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    const promise = requestFn();
    this.requestQueue.set(key, promise);

    try {
      const data = await promise;
      this.requestCache.set(key, { data, timestamp: Date.now() });
      return data;
    } finally {
      this.requestQueue.delete(key);
    }
  }
  
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.isBackendAvailable = response.ok;
      return response.ok;
    } catch (error) {
      this.isBackendAvailable = false;
      return false;
    }
  }

  async register(data: LoginData): Promise<AuthResponse> {
    // Check backend availability first
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      throw new Error('Backend server is not available. Please try again later.');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        this.isBackendAvailable = false;
        throw new Error('Cannot connect to server. Please check your internet connection or try again later.');
      }
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    // Check backend availability first
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      throw new Error('Backend server is not available. Please try again later.');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        this.isBackendAvailable = false;
        throw new Error('Cannot connect to server. Please check your internet connection or try again later.');
      }
      throw error;
    }
  }

  async verifyToken(): Promise<{ user: { id: string; email: string; name?: string; phone?: string; location?: string; bio?: string } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error - backend is down, but token might still be valid
        throw new Error('NETWORK_ERROR');
      }
      throw error;
    }
  }

  async updateProfile(data: ProfileData): Promise<{ message: string; user: { id: string; email: string; name?: string; phone?: string; location?: string; bio?: string } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Profile update failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Cannot connect to server');
      }
      throw error;
    }
  }

  async getRecipes(): Promise<RecipesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch recipes');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Cannot connect to server');
      }
      throw error;
    }
  }

  async createRecipe(recipe: Recipe): Promise<RecipeResponse> {
    try {
      // Transform recipe data to match backend expectations
      const recipeData = {
        title: recipe.title || recipe.name || 'Untitled Recipe',
        name: recipe.name || recipe.title || 'Untitled Recipe',
        description: recipe.description || '',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        difficulty: recipe.difficulty || 'medium',
        tags: recipe.tags || []
      };

      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create recipe');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Cannot connect to server');
      }
      throw error;
    }
  }

  async deleteRecipe(recipeId: number | string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete recipe');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Cannot connect to server');
      }
      throw error;
    }
  }

  async getShoppingItems(): Promise<{ items: any[] }> {
    const response = await fetch(`${API_BASE_URL}/shopping/items`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get shopping items');
    }

    return response.json();
  }

  async addShoppingItem(data: { item_name: string; category?: string; quantity?: number; unit?: string }): Promise<{ message: string; item: any }> {
    const response = await fetch(`${API_BASE_URL}/shopping/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add item');
    }

    return response.json();
  }

  async getRecentItems(): Promise<{ recent_items: any[] }> {
    const response = await fetch(`${API_BASE_URL}/shopping/recent`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get recent items');
    }

    return response.json();
  }

  async deleteRecentItem(itemId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/shopping/recent/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete recent item');
    }

    return response.json();
  }

  async updateShoppingItem(itemId: string, data: { is_completed?: boolean; quantity?: number }): Promise<{ message: string; item: any }> {
    const response = await fetch(`${API_BASE_URL}/shopping/items/${itemId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update item');
    }

    return response.json();
  }

  async deleteShoppingItem(itemId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/shopping/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete item');
    }

    return response.json();
  }

  async getDiscoverRecipes(): Promise<{ recipes: any[] }> {
    return this.cachedRequest('discover-recipes', async () => {
      const response = await fetch(`${API_BASE_URL}/discover/recipes`, {
        headers: this.getAuthHeaders()
      });
      return response.ok ? response.json() : { recipes: [] };
    }, 600000);
  }

  async getSavedRecipes(): Promise<{ saved_recipes: any[] }> {
    const response = await fetch(`${API_BASE_URL}/user-recipes`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get saved recipes');
    }

    return response.json();
  }

  async unsaveRecipe(recipeId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/save`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to unsave recipe');
    }

    return response.json();
  }

  async getSavedRecipesNew(): Promise<{ saved_recipes: any[] }> {
    const response = await fetch(`${API_BASE_URL}/saved-recipes`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get saved recipes');
    }

    return response.json();
  }

  async saveRecipeNew(recipeId: string, recipeData: any): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/saved-recipes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        recipe_id: recipeId,
        recipe_data: recipeData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save recipe');
    }

    return response.json();
  }

  async unsaveRecipeNew(recipeId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/saved-recipes?recipe_id=${recipeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to unsave recipe');
    }

    return response.json();
  }

  async getRecipeDetails(recipeId: string): Promise<{ recipe: any }> {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/details`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get recipe details');
    }

    return response.json();
  }

  async deleteAccount(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete account');
    }

    return response.json();
  }

  async changePassword(data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change password');
    }

    return response.json();
  }

  async getMealPlan(week: string = 'Week - 1'): Promise<{ meal_plan: any[] }> {
    const response = await fetch(`${API_BASE_URL}/meal-plan?week=${encodeURIComponent(week)}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get meal plan');
    }

    return response.json();
  }

  async addToMealPlan(data: { recipe_id: string | number; recipe_name: string; day: string; meal_time: string; servings?: number; image?: string; time?: string; week?: string }): Promise<{ message: string; meal: any }> {
    const response = await fetch(`${API_BASE_URL}/meal-plan`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        week: data.week || 'Week - 1' // Default to Week - 1 if not provided
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add to meal plan');
    }

    return response.json();
  }

  async removeFromMealPlan(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/meal-plan?id=${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to remove from meal plan');
    }

    return response.json();
  }

  // Person Management
  async getPersons(): Promise<{ persons: any[] }> {
    const response = await fetch(`${API_BASE_URL}/persons`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get persons');
    }

    return response.json();
  }

  async addPerson(data: { name: string; preferences?: string; allergies?: string }): Promise<{ message: string; person: any }> {
    const response = await fetch(`${API_BASE_URL}/persons`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to add person');
    }

    return response.json();
  }

  async updatePerson(personId: string, data: { name?: string; preferences?: string; allergies?: string }): Promise<{ message: string; person: any }> {
    const response = await fetch(`${API_BASE_URL}/persons/${personId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update person');
    }

    return response.json();
  }

  async deletePerson(personId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/persons/${personId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete person');
    }

    return response.json();
  }

  // User Preferences
  async getPreferences(): Promise<{ preferences: any }> {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get preferences');
    }

    const result = await response.json();
    // Ensure selected_week defaults to Week - 1
    if (!result.preferences.selected_week) {
      result.preferences.selected_week = 'Week - 1';
    }
    return result;
  }

  async updatePreferences(data: { selected_week?: string; view_mode?: string }): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        selected_week: data.selected_week || 'Week - 1' // Ensure default week
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }

    return response.json();
  }

  // Bulk Meal Planning
  async createMonthPlan(month: number, year: number, week: string = 'Week - 1'): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/meal-plan/bulk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ month, year, week })
    });

    if (!response.ok) {
      throw new Error('Failed to create month plan');
    }

    return response.json();
  }

  // Analytics
  async getAnalytics(): Promise<{ analytics: any }> {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get analytics');
    }

    return response.json();
  }

  // Admin Meal Plan Templates
  async getAdminMealPlanTemplates(): Promise<{ templates: any[] }> {
    const response = await fetch(`${API_BASE_URL}/meal-plans/admin-templates`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get meal plan templates');
    }

    return response.json();
  }

  async applyMealPlanTemplate(templateId: string, week: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/meal-plans/apply-template`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ template_id: templateId, week })
    });

    if (!response.ok) {
      throw new Error('Failed to apply meal plan template');
    }

    return response.json();
  }

  // Recipe sync methods
  async getRecipeNotifications(): Promise<{ notifications: any[] }> {
    try {
      const response = await fetch(`${config.adminApiUrl}/admin/recipes/sync`, {
        headers: this.getAuthHeaders()
      });
      
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Recipe notifications not available');
    }
    
    return { notifications: [] };
  }

  async getAdminRecipes(): Promise<{ recipes: any[] }> {
    try {
      const response = await fetch(`${config.adminApiUrl}/admin/recipes/discover`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Admin recipes not available');
    }
    
    return { recipes: [] };
  }

  // Generic request method for meal plan sync service
  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();

// Recipe service for backward compatibility
export const recipeService = {
  async getRecipes() {
    return apiService.getRecipes();
  },
  async createRecipe(recipe: Recipe) {
    return apiService.createRecipe(recipe);
  },
  async deleteRecipe(id: number | string) {
    return apiService.deleteRecipe(id);
  }
};