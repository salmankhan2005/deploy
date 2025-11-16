const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://127.0.0.1:5000/api/admin';

interface AdminLoginData {
  email: string;
  password: string;
}

interface AdminResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

class AdminApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(data: AdminLoginData): Promise<AdminResponse> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    
    // Store token and admin data
    localStorage.setItem('admin_token', result.token);
    localStorage.setItem('admin_user', JSON.stringify(result.admin));
    
    return result;
  }

  async verifyToken(): Promise<{ admin: AdminUser }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/auth/verify`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return response.json();
  }

  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    // Clear local storage regardless of response
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  }

  async getAdminUsers(): Promise<{ admins: AdminUser[] }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/users`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get admin users');
    }

    return response.json();
  }

  async createAdminUser(data: { email: string; password: string; name: string; role: string }): Promise<{ message: string; admin: AdminUser }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create admin user');
    }

    return response.json();
  }

  getCurrentAdmin(): AdminUser | null {
    const adminData = localStorage.getItem('admin_user');
    return adminData ? JSON.parse(adminData) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  hasPermission(permission: string): boolean {
    const admin = this.getCurrentAdmin();
    return admin?.permissions?.includes(permission) || false;
  }

  async getRegularUsers(): Promise<{ users: any[] }> {
    try {
      const response = await fetch('https://ewrdpygljsrmgyidqjok.supabase.co/rest/v1/users?select=id,email,name,created_at,updated_at', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cmRweWdsanNybWd5aWRxam9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTk1MzUsImV4cCI6MjA3NjIzNTUzNX0.SXu--5GvHHt0EcPdaeP-q_0XRbYIM5oapk5Q2LRHaB4',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cmRweWdsanNybWd5aWRxam9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTk1MzUsImV4cCI6MjA3NjIzNTUzNX0.SXu--5GvHHt0EcPdaeP-q_0XRbYIM5oapk5Q2LRHaB4',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const users = await response.json();
        return { users };
      }
    } catch (error) {
      console.log('Direct Supabase query failed, using mock data');
    }
    
    const now = new Date();
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15T10:00:00Z', updated_at: new Date(now.getTime() - Math.random() * 3600000).toISOString() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-02-20T09:15:00Z', updated_at: new Date(now.getTime() - Math.random() * 1800000).toISOString() },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', created_at: '2024-03-10T11:45:00Z', updated_at: Math.random() > 0.5 ? new Date(now.getTime() - Math.random() * 7200000).toISOString() : null }
    ];
    
    return { users: mockUsers };
  }

  async getAdminMealPlans(): Promise<{ meal_plans: any[] }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get meal plans');
    }

    return response.json();
  }

  async createAdminMealPlan(data: any): Promise<{ meal_plan: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create meal plan');
    }

    return response.json();
  }

  async updateAdminMealPlan(id: string, data: any): Promise<{ meal_plan: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update meal plan');
    }

    return response.json();
  }

  async deleteAdminMealPlan(id: string): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete meal plan');
    }
  }

  // Recipe management methods
  async getAdminRecipes(): Promise<{ recipes: any[] }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/recipes`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get admin recipes');
    }

    return response.json();
  }

  async createAdminRecipe(data: any): Promise<{ message: string; recipe: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create recipe');
    }

    return response.json();
  }

  async updateAdminRecipe(recipeId: string, data: any): Promise<{ message: string; recipe: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/recipes/${recipeId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update recipe');
    }

    return response.json();
  }

  async deleteAdminRecipe(recipeId: string): Promise<{ message: string }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/recipes/${recipeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete recipe');
    }

    return response.json();
  }

  // Meal Plans
  async getAdminMealPlans(): Promise<{ meal_plans: any[] }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get meal plans');
    }

    return response.json();
  }

  async createAdminMealPlan(data: any): Promise<{ message: string; meal_plan: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create meal plan');
    }

    return response.json();
  }

  async updateAdminMealPlan(planId: string, data: any): Promise<{ message: string; meal_plan: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans/${planId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update meal plan');
    }

    return response.json();
  }

  async deleteAdminMealPlan(planId: string): Promise<{ message: string }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/meal-plans/${planId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete meal plan');
    }

    return response.json();
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<{ plans: any[] }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/subscription-plans`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get subscription plans');
    }

    return response.json();
  }

  async createSubscriptionPlan(data: any): Promise<{ message: string; plan: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/subscription-plans`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create subscription plan');
    }

    return response.json();
  }

  async updateSubscriptionPlan(planId: string, data: any): Promise<{ message: string; plan: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/subscription-plans/${planId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update subscription plan');
    }

    return response.json();
  }

  async deleteSubscriptionPlan(planId: string): Promise<{ message: string }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/subscription-plans/${planId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete subscription plan');
    }

    return response.json();
  }

  async updateAdminUser(adminId: string, data: { name: string; email: string; role: string }): Promise<{ message: string; admin: any }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/users/${adminId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update admin user');
    }

    return response.json();
  }

  async deleteAdminUser(adminId: string): Promise<{ message: string }> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/users/${adminId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete admin user');
    }

    return response.json();
  }
}

export const adminApiService = new AdminApiService();

// Recipe sync service for real-time updates
export class RecipeSyncService {
  private eventSource: EventSource | null = null;
  private listeners: ((data: any) => void)[] = [];

  startListening() {
    // In a real implementation, this would use Server-Sent Events or WebSockets
    // For now, we'll poll for changes
    setInterval(async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/admin/recipes/sync');
        if (response.ok) {
          const data = await response.json();
          this.notifyListeners(data);
        }
      } catch (error) {
        // Silently handle connection errors
      }
    }, 30000); // Poll every 30 seconds
  }

  addListener(callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: any) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  private notifyListeners(data: any) {
    this.listeners.forEach(listener => listener(data));
  }

  stopListening() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const recipeSyncService = new RecipeSyncService();