import { apiService } from './api';

export interface AdminMealPlan {
  id: string;
  name: string;
  description: string;
  week_start: string;
  meals: Record<string, Record<string, any>>;
  created_by: string;
  is_admin_template: boolean;
  created_at: string;
}

export interface MealPlanNotification {
  id: string;
  type: string;
  action: string;
  meal_plan_id: string;
  meal_plan_data: AdminMealPlan;
  timestamp: string;
  status: string;
}

class MealPlanSyncService {
  private lastSyncTime: string | null = null;

  /**
   * Get available admin meal plan templates
   */
  async getAdminTemplates(): Promise<AdminMealPlan[]> {
    try {
      const response = await apiService.request('/meal-plans/admin-templates', {
        method: 'GET'
      });
      return response.templates || [];
    } catch (error) {
      console.error('Failed to get admin templates:', error);
      return [];
    }
  }

  /**
   * Apply an admin meal plan template to user's meal plan
   */
  async applyTemplate(templateId: string, targetWeek: string = 'Week - 1'): Promise<boolean> {
    try {
      const response = await apiService.request('/meal-plans/apply-template', {
        method: 'POST',
        body: JSON.stringify({
          template_id: templateId,
          week: targetWeek
        })
      });
      
      return response.message !== undefined;
    } catch (error) {
      console.error('Failed to apply template:', error);
      return false;
    }
  }

  /**
   * Get meal plan sync notifications
   */
  async getSyncNotifications(): Promise<MealPlanNotification[]> {
    try {
      const url = this.lastSyncTime 
        ? `/meal-plans/sync?last_sync=${encodeURIComponent(this.lastSyncTime)}`
        : '/meal-plans/sync';
        
      const response = await apiService.request(url, {
        method: 'GET'
      });
      
      if (response.notifications && response.notifications.length > 0) {
        this.lastSyncTime = new Date().toISOString();
      }
      
      return response.notifications || [];
    } catch (error) {
      console.error('Failed to get sync notifications:', error);
      return [];
    }
  }

  /**
   * Check for meal plan updates and sync
   */
  async checkForUpdates(): Promise<{
    hasUpdates: boolean;
    notifications: MealPlanNotification[];
  }> {
    const notifications = await this.getSyncNotifications();
    return {
      hasUpdates: notifications.length > 0,
      notifications
    };
  }

  /**
   * Process meal plan notifications
   */
  async processNotifications(notifications: MealPlanNotification[]): Promise<void> {
    for (const notification of notifications) {
      try {
        switch (notification.action) {
          case 'create':
            console.log(`New meal plan available: ${notification.meal_plan_data.name}`);
            break;
          case 'update':
            console.log(`Meal plan updated: ${notification.meal_plan_data.name}`);
            break;
          case 'delete':
            console.log(`Meal plan removed: ${notification.meal_plan_data.name}`);
            break;
        }
      } catch (error) {
        console.error('Failed to process notification:', error);
      }
    }
  }

  /**
   * Start periodic sync checking
   */
  startPeriodicSync(intervalMs: number = 30000): () => void {
    const interval = setInterval(async () => {
      const { hasUpdates, notifications } = await this.checkForUpdates();
      if (hasUpdates) {
        await this.processNotifications(notifications);
        // Emit custom event for UI updates
        window.dispatchEvent(new CustomEvent('mealPlanSync', { 
          detail: { notifications } 
        }));
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }

  /**
   * Get formatted meal plan for display
   */
  formatMealPlanForDisplay(adminPlan: AdminMealPlan) {
    const formattedMeals: any[] = [];
    
    Object.entries(adminPlan.meals).forEach(([day, dayMeals]) => {
      Object.entries(dayMeals).forEach(([mealTime, mealData]: [string, any]) => {
        formattedMeals.push({
          id: `${adminPlan.id}_${day}_${mealTime}`,
          day,
          mealTime,
          recipeName: mealData.recipe_name,
          servings: mealData.servings || 1,
          image: mealData.image || '🍽️',
          isAdminGenerated: true,
          adminMealPlanId: adminPlan.id
        });
      });
    });
    
    return formattedMeals;
  }
}

export const mealPlanSyncService = new MealPlanSyncService();