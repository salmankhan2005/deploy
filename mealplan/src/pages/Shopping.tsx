import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/LoadingButton';
import { GlowCard } from '@/components/GlowCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Check, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedRecipes } from '@/contexts/SavedRecipesContext';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { useRecipeContext } from '@/contexts/RecipeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { InventoryAnimation } from '@/components/InventoryAnimation';
import { apiService } from '@/services/api';
import { RecentItemsManager } from '@/utils/recentItemsManager';
import { sanitizeHtml, validateInput, sanitizeLogData } from '@/utils/security';
import { ErrorHandler } from '@/utils/errorHandler';

const mockItems = [
  { id: 1, name: 'Chicken Breast', category: 'Meat', checked: false },
  { id: 2, name: 'Mixed Salad', category: 'Vegetables', checked: false },
  { id: 3, name: 'Olive Oil', category: 'Pantry', checked: true },
  { id: 4, name: 'Spaghetti', category: 'Pasta', checked: false },
];

export const Shopping = () => {
  const { isAuthenticated, isGuest } = useAuth();
  const { savedRecipes } = useSavedRecipes();
  const { mealPlan } = useMealPlan();
  const { recipes } = useRecipeContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<typeof mockItems>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [activeTab, setActiveTab] = useState('final');
  const [allItems, setAllItems] = useState<typeof mockItems>([]);
  const [pastItems, setPastItems] = useState<typeof mockItems>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [addItemLoading, setAddItemLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipeIngredients, setRecipeIngredients] = useState<typeof mockItems>([]);
  const [mealIngredients, setMealIngredients] = useState<typeof mockItems>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadShoppingData();
    } else {
      // Load from localStorage for guest mode
      const savedItems = localStorage.getItem('guest_shopping_items');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Save to localStorage when items change in guest mode
  useEffect(() => {
    if (isGuest && items.length > 0) {
      localStorage.setItem('guest_shopping_items', JSON.stringify(items));
    }
  }, [items, isGuest]);
  
  useEffect(() => {
    loadRecipeIngredients();
  }, [savedRecipes, recipes, isGuest]);

  // Load meal ingredients whenever meal plan changes
  useEffect(() => {
    loadMealIngredients();
  }, [mealPlan, recipes]);

  // Force refresh on component mount to catch any missed updates
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMealIngredients();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for meal plan updates
  useEffect(() => {
    const handleMealsUpdated = () => {
      setTimeout(() => loadMealIngredients(), 100);
    };
    
    const handleStorageChange = () => {
      setTimeout(() => loadMealIngredients(), 100);
    };
    
    window.addEventListener('mealsUpdated', handleMealsUpdated);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('mealsUpdated', handleMealsUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [recipes]);



  const loadMealIngredients = () => {
    const ingredientItems: any[] = [];
    
    // For guest users, check localStorage directly
    if (isGuest) {
      try {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('guestMealPlan_'));
        
        keys.forEach(key => {
          const guestMealPlan = localStorage.getItem(key);
          
          if (guestMealPlan) {
            const parsedMealPlan = JSON.parse(guestMealPlan);
            
            Object.entries(parsedMealPlan).forEach(([day, dayMeals]: [string, any]) => {
              if (Array.isArray(dayMeals)) {
                dayMeals.forEach((meal) => {
                  // For guest meals, ingredients might be stored directly in the meal
                  if (meal.ingredients && Array.isArray(meal.ingredients)) {
                    meal.ingredients.forEach((ingredient: string, index: number) => {
                      if (ingredient && typeof ingredient === 'string') {
                        ingredientItems.push({
                          id: `meal-${meal.id}-${index}`,
                          name: sanitizeHtml(ingredient.trim()),
                          category: categorizeIngredient(ingredient),
                          checked: false,
                          mealTime: meal.mealTime,
                          recipeName: meal.recipeName,
                          day: day,
                          source: 'mealplan'
                        });
                      }
                    });
                  } else {
                    // Try to find recipe from RecipeContext or localStorage
                    let recipe = recipes.find(r => r.id?.toString() === meal.recipeId?.toString());
                    
                    // If not found in RecipeContext, check localStorage for guest recipes
                    if (!recipe) {
                      try {
                        const recipeKeys = Object.keys(localStorage).filter(key => 
                          key.includes('recipe') || key.includes('Recipe') || key.includes('guest')
                        );
                        
                        for (const key of recipeKeys) {
                          try {
                            const data = localStorage.getItem(key);
                            if (data) {
                              const parsed = JSON.parse(data);
                              
                              if (Array.isArray(parsed)) {
                                recipe = parsed.find((r: any) => r.id?.toString() === meal.recipeId?.toString());
                                if (recipe) break;
                                
                                // Also try name matching within this array
                                recipe = parsed.find((r: any) => 
                                  (r.name && r.name.toLowerCase() === meal.recipeName.toLowerCase()) ||
                                  (r.title && r.title.toLowerCase() === meal.recipeName.toLowerCase())
                                );
                                if (recipe) break;
                              }
                            }
                          } catch (e) {
                            // Skip invalid JSON
                          }
                        }
                        
                        // Fallback: try to match by name in RecipeContext
                        if (!recipe) {
                          recipe = recipes.find(r => 
                            (r.name && r.name.toLowerCase() === meal.recipeName.toLowerCase()) ||
                            (r.title && r.title.toLowerCase() === meal.recipeName.toLowerCase())
                          );
                        }
                        
                        // Last resort: create basic ingredients from recipe name
                        if (!recipe && meal.recipeName) {
                          console.log('Creating basic ingredients for recipe:', meal.recipeName, 'with ID:', meal.recipeId);
                          const recipeName = meal.recipeName.toLowerCase();
                          let basicIngredients = [];
                          
                          if (recipeName.includes('coffee')) {
                            basicIngredients = ['Coffee', 'Bread', 'Butter'];
                          } else if (recipeName.includes('chicken') && recipeName.includes('salad')) {
                            basicIngredients = ['Chicken Breast', 'Mixed Greens', 'Cherry Tomatoes', 'Olive Oil', 'Lemon'];
                          } else if (recipeName.includes('chicken')) {
                            basicIngredients = ['Chicken Breast', 'Salt', 'Black Pepper', 'Olive Oil'];
                          } else if (recipeName.includes('salad')) {
                            basicIngredients = ['Lettuce', 'Tomato', 'Cucumber', 'Dressing'];
                          } else if (recipeName.includes('pasta')) {
                            basicIngredients = ['Pasta', 'Tomato Sauce', 'Garlic', 'Olive Oil'];
                          } else if (recipeName.includes('soup')) {
                            basicIngredients = ['Vegetables', 'Broth', 'Onion', 'Salt'];
                          } else if (recipeName.includes('sandwich')) {
                            basicIngredients = ['Bread', 'Meat', 'Cheese', 'Lettuce'];
                          } else if (recipeName.includes('rice')) {
                            basicIngredients = ['Rice', 'Water', 'Salt', 'Oil'];
                          } else if (recipeName.includes('fish')) {
                            basicIngredients = ['Fish Fillet', 'Lemon', 'Salt', 'Olive Oil'];
                          } else {
                            // Generic ingredients based on recipe name
                            const words = meal.recipeName.split(' ');
                            basicIngredients = words.length > 1 
                              ? [words[0], words[1], 'Salt', 'Oil']
                              : [meal.recipeName, 'Salt', 'Oil'];
                          }
                          
                          console.log('Generated ingredients:', basicIngredients);
                          basicIngredients.forEach((ingredient, index) => {
                            ingredientItems.push({
                              id: `meal-${meal.id}-${index}`,
                              name: sanitizeHtml(ingredient),
                              category: categorizeIngredient(ingredient),
                              checked: false,
                              mealTime: meal.mealTime,
                              recipeName: meal.recipeName,
                              day: day,
                              source: 'mealplan'
                            });
                          });
                        }
                      } catch (error) {
                        console.error('Error loading guest recipes:', error);
                      }
                    }
                    
                    if (recipe && recipe.ingredients) {
                      recipe.ingredients.forEach((ingredient: string, index) => {
                        if (ingredient && typeof ingredient === 'string') {
                          ingredientItems.push({
                            id: `meal-${meal.id}-${index}`,
                            name: sanitizeHtml(ingredient.trim()),
                            category: categorizeIngredient(ingredient),
                            checked: false,
                            mealTime: meal.mealTime,
                            recipeName: meal.recipeName,
                            day: day,
                            source: 'mealplan'
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      } catch (error) {
        console.error('Error loading guest meal plan:', error);
      }
    }
    
    // Also get ingredients from meal plan context (as backup)
    console.log('Processing MealPlanContext data...');
    Object.entries(mealPlan).forEach(([day, dayMeals]) => {
      console.log(`Processing ${day} with ${dayMeals.length} meals from context`);
      dayMeals.forEach((meal, mealIndex) => {
        console.log(`Context meal ${mealIndex}:`, meal);
        // Find recipe details for this meal
        const recipe = recipes.find(r => r.id?.toString() === meal.recipeId?.toString());
        console.log(`Found recipe for context meal ${mealIndex}:`, recipe);
        
        if (recipe && recipe.ingredients) {
          recipe.ingredients.forEach((ingredient: string, index) => {
            if (ingredient && typeof ingredient === 'string') {
              // Check if this ingredient is already added from localStorage
              const existingId = `meal-${meal.id}-${index}`;
              if (!ingredientItems.find(item => item.id === existingId)) {
                console.log(`Adding ingredient from context: ${ingredient}`);
                ingredientItems.push({
                  id: existingId,
                  name: sanitizeHtml(ingredient.trim()),
                  category: categorizeIngredient(ingredient),
                  checked: false,
                  mealTime: meal.mealTime,
                  recipeName: meal.recipeName,
                  day: day,
                  source: 'mealplan'
                });
              }
            }
          });
        } else if (!recipe) {
          console.log(`No recipe found for context meal, creating basic ingredients for: ${meal.recipeName}`);
          // Create basic ingredients for meals without recipes
          const recipeName = meal.recipeName.toLowerCase();
          let basicIngredients = [];
          
          if (recipeName.includes('chicken') && recipeName.includes('salad')) {
            basicIngredients = ['Chicken Breast', 'Mixed Greens', 'Cherry Tomatoes', 'Olive Oil', 'Lemon'];
          } else if (recipeName.includes('chicken')) {
            basicIngredients = ['Chicken Breast', 'Salt', 'Black Pepper', 'Olive Oil'];
          } else if (recipeName.includes('salad')) {
            basicIngredients = ['Lettuce', 'Tomato', 'Cucumber', 'Dressing'];
          } else if (recipeName.includes('pasta')) {
            basicIngredients = ['Pasta', 'Tomato Sauce', 'Garlic', 'Olive Oil'];
          } else if (recipeName.includes('soup')) {
            basicIngredients = ['Vegetables', 'Broth', 'Onion', 'Salt'];
          } else {
            // Generic ingredients based on recipe name
            const words = meal.recipeName.split(' ');
            basicIngredients = words.length > 1 
              ? [words[0], words[1], 'Salt', 'Oil']
              : [meal.recipeName, 'Salt', 'Oil'];
          }
          
          basicIngredients.forEach((ingredient, index) => {
            const existingId = `meal-${meal.id}-${index}`;
            if (!ingredientItems.find(item => item.id === existingId)) {
              console.log(`Adding basic ingredient from context: ${ingredient}`);
              ingredientItems.push({
                id: existingId,
                name: sanitizeHtml(ingredient),
                category: categorizeIngredient(ingredient),
                checked: false,
                mealTime: meal.mealTime,
                recipeName: meal.recipeName,
                day: day,
                source: 'mealplan'
              });
            }
          });
        }
      });
    });
    
    // Automatically add meal ingredients to final items
    setItems(prev => {
      const existingItemNames = prev.map(item => item.name.toLowerCase());
      const newMealItems = ingredientItems.filter(ingredient => 
        !existingItemNames.includes(ingredient.name.toLowerCase())
      );
      
      if (newMealItems.length > 0) {
        const updatedItems = [...newMealItems, ...prev];
        
        // Save to localStorage for guest mode
        if (isGuest) {
          localStorage.setItem('guest_shopping_items', JSON.stringify(updatedItems));
        }
        
        return updatedItems;
      }
      
      return prev;
    });
    
    setMealIngredients(ingredientItems);
  };

  const loadRecipeIngredients = async () => {
    const ingredients = new Set<string>();
    
    // Add some default ingredients for testing
    const defaultIngredients = [
      'Chicken Breast', 'Olive Oil', 'Salt', 'Black Pepper', 'Garlic',
      'Onion', 'Tomatoes', 'Rice', 'Pasta', 'Cheese', 'Milk', 'Eggs'
    ];
    
    defaultIngredients.forEach(ingredient => {
      ingredients.add(ingredient);
    });
    
    // Get ingredients from saved recipes
    savedRecipes.forEach(recipe => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
          if (ingredient && typeof ingredient === 'string') {
            ingredients.add(ingredient.trim());
          }
        });
      }
    });
    
    // Get ingredients from guest meals (localStorage)
    try {
      const guestMeals = localStorage.getItem('guest_meals');
      if (guestMeals) {
        const meals = JSON.parse(guestMeals);
        Object.values(meals).forEach((dayMeals: any) => {
          if (Array.isArray(dayMeals)) {
            dayMeals.forEach((meal: any) => {
              if (meal.ingredients && Array.isArray(meal.ingredients)) {
                meal.ingredients.forEach((ingredient: string) => {
                  if (ingredient && typeof ingredient === 'string') {
                    ingredients.add(ingredient.trim());
                  }
                });
              }
            });
          }
        });
      }
    } catch (error) {
      ErrorHandler.logError(
        ErrorHandler.handleApiError(error),
        'loadRecipeIngredients'
      );
    }
    
    // Convert to shopping items format
    const ingredientItems = Array.from(ingredients).map((ingredient, index) => ({
      id: `ingredient-${index}`,
      name: sanitizeHtml(ingredient),
      category: categorizeIngredient(ingredient),
      checked: false
    }));
    
    setRecipeIngredients(ingredientItems);
  };
  
  const categorizeIngredient = (ingredient: string): string => {
    const lower = ingredient.toLowerCase();
    if (lower.includes('chicken') || lower.includes('beef') || lower.includes('pork') || lower.includes('fish') || lower.includes('salmon')) return 'Meat';
    if (lower.includes('tomato') || lower.includes('onion') || lower.includes('carrot') || lower.includes('lettuce') || lower.includes('spinach')) return 'Vegetables';
    if (lower.includes('apple') || lower.includes('banana') || lower.includes('orange') || lower.includes('berry')) return 'Fruits';
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('yogurt') || lower.includes('butter')) return 'Dairy';
    if (lower.includes('pasta') || lower.includes('spaghetti') || lower.includes('noodle')) return 'Pasta';
    if (lower.includes('oil') || lower.includes('salt') || lower.includes('pepper') || lower.includes('flour') || lower.includes('sugar')) return 'Pantry';
    return 'Other';
  };

  const loadShoppingData = async () => {
    try {
      const [shoppingResponse, recentResponse] = await Promise.all([
        apiService.getShoppingItems(),
        apiService.getRecentItems()
      ]);
      
      setItems(shoppingResponse.items.map(item => ({
        id: item.id,
        name: item.item_name,
        category: item.category,
        checked: item.is_completed
      })));
      
      // Filter out deleted items
      const deletedItems = JSON.parse(localStorage.getItem('deletedRecentItems') || '[]');
      const filteredItems = recentResponse.recent_items.filter(item => !deletedItems.includes(item.id));
      setRecentItems(filteredItems);
    } catch (error) {
      // Fallback to localStorage when backend is unavailable
      const savedItems = localStorage.getItem('guest_shopping_items');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      setRecentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (id: number | string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    try {
      if (isAuthenticated) {
        await apiService.updateShoppingItem(String(id), {
          is_completed: !item.checked
        });
      }
      
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      setItems(updatedItems);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const shareToWhatsApp = () => {
    const checkedItems = items.filter(item => item.checked);
    if (checkedItems.length === 0) return;
    
    const message = `🛒 Shopping List:\n\n${checkedItems.map(item => `✅ ${item.name} (${item.category})`).join('\n')}\n\nShared from FreshPlate`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  const checkedItemsCount = items.filter(item => item.checked).length;

  const deleteItem = async (id: number | string) => {
    try {
      if (isAuthenticated) {
        await apiService.deleteShoppingItem(String(id));
      }
      
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Item removed",
        description: "Item has been deleted from your list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addItem = async () => {
    const trimmedName = newItemName.trim();
    
    if (!trimmedName || !newItemCategory) {
      toast({
        title: "Missing information",
        description: "Please enter item name and category",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateInput(trimmedName, 100)) {
      toast({
        title: "Invalid input",
        description: "Item name contains invalid characters or is too long",
        variant: "destructive",
      });
      return;
    }

    setAddItemLoading(true);
    
    try {
      if (isAuthenticated) {
        const response = await apiService.addShoppingItem({
          item_name: sanitizeHtml(trimmedName),
          category: newItemCategory,
          quantity: 1,
          unit: 'pcs'
        });
        
        const newItem = {
          id: response.item.id,
          name: response.item.item_name,
          category: response.item.category,
          checked: response.item.is_completed
        };
        
        setItems([newItem, ...items]);
        
        // Refresh recent items with filtering
        const recentResponse = await apiService.getRecentItems();
        const deletedItems = JSON.parse(localStorage.getItem('deletedRecentItems') || '[]');
        const filteredItems = recentResponse.recent_items.filter(item => !deletedItems.includes(item.id));
        setRecentItems(filteredItems);
      } else {
        // Fallback for non-authenticated users
        const newItem = {
          id: Math.max(...items.map(i => typeof i.id === 'number' ? i.id : 0), 0) + 1,
          name: sanitizeHtml(trimmedName),
          category: newItemCategory,
          checked: false,
        };
        setItems([...items, newItem]);
      }
      
      setNewItemName('');
      setNewItemCategory('');
      setIsDialogOpen(false);
      
      toast({
        title: "Item added",
        description: `${newItemName} has been added to your list`,
      });
    } catch (error) {
      const appError = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(appError, 'addItem');
      toast({
        title: "Error",
        description: appError.message,
        variant: "destructive",
      });
    } finally {
      setAddItemLoading(false);
    }
  };

  const addRecentItem = async (recentItem: any) => {
    try {
      if (isAuthenticated) {
        const response = await apiService.addShoppingItem({
          item_name: recentItem.item_name,
          category: recentItem.category,
          quantity: 1,
          unit: 'pcs'
        });
        
        const newItem = {
          id: response.item.id,
          name: response.item.item_name,
          category: response.item.category,
          checked: response.item.is_completed
        };
        
        setItems([newItem, ...items]);
        
        toast({
          title: "Item added",
          description: `${recentItem.item_name} has been added to your list`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteRecentItem = async (recentItemId: string) => {
    // Remove from UI immediately
    setRecentItems(prev => prev.filter(item => item.id !== recentItemId));
    
    // Store in localStorage to prevent reappearing
    const deletedItems = JSON.parse(localStorage.getItem('deletedRecentItems') || '[]');
    deletedItems.push(recentItemId);
    localStorage.setItem('deletedRecentItems', JSON.stringify(deletedItems));
    
    toast({
      title: "Recent item removed",
      description: "Item will not appear again",
    });
  };

  // Utility function to clear deleted recent items history (for maintenance)
  const clearDeletedRecentItems = () => {
    localStorage.removeItem('deletedRecentItems');
    if (isAuthenticated) {
      loadShoppingData();
    }
    toast({
      title: "Recent items history cleared",
      description: "All previously deleted recent items will reappear",
    });
  };
  
  const handleDone = () => {
    // Move current items to past (push current past to history)
    if (pastItems.length > 0) {
      // Keep only the most recent past list
      setPastItems(items);
    } else {
      setPastItems(items);
    }
    
    // Move current items to all items
    setAllItems(prev => [...items, ...prev]);
    
    // Clear current items
    setItems([]);
    
    toast({
      title: "Shopping completed!",
      description: "List moved to completed items",
    });
  };

  const ShoppingList = () => (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <GlowCard key={item.id} className={`p-4 animate-fade-up hover:shadow-md ${
          item.source === 'mealplan' 
            ? 'bg-card border-primary/20'
            : 'bg-card'
        }`} 
              style={{ animationDelay: `${idx * 0.05}s` }}>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => toggleItem(item.id)}
              className="data-[state=checked]:bg-primary"
            />
            <div className="flex-1">
              <p className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
              {item.source === 'mealplan' && (
                <p className="text-xs text-primary">{item.day} • {item.mealTime} • {item.recipeName}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </GlowCard>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-24">
      <Header 
        title="Shopping List" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-4xl mx-auto">
        {/* Inventory Animation */}
        <div className="mb-8 flex justify-center">
          <InventoryAnimation className="w-48 h-32" />
        </div>

        {/* Custom Tab Navigation */}
        <div className="mb-8">
          <div className="bg-muted/30 rounded-full p-2 flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-6 rounded-full text-center font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              All items
            </button>
            <button
              onClick={() => setActiveTab('final')}
              className={`flex-1 py-3 px-6 rounded-full text-center font-medium transition-all ${
                activeTab === 'final'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              Final Items
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            <div className="space-y-3">
              {recipeIngredients.map((ingredient, idx) => (
                <GlowCard key={ingredient.id} className="p-4 animate-fade-up bg-card hover:shadow-md" 
                      style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={false} className="data-[state=checked]:bg-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{ingredient.name}</p>
                        <p className="text-xs text-muted-foreground">{ingredient.category}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const newItem = {
                          id: Math.max(...items.map(i => typeof i.id === 'number' ? i.id : 0), 0) + 1,
                          name: ingredient.name,
                          category: ingredient.category,
                          checked: false
                        };
                        const updatedItems = [newItem, ...items];
                        setItems(updatedItems);
                        
                        // Save to localStorage for guest mode
                        if (isGuest) {
                          localStorage.setItem('guest_shopping_items', JSON.stringify(updatedItems));
                        }
                        
                        toast({
                          title: "Item added",
                          description: `${ingredient.name} added to your shopping list`,
                        });
                      }}
                      className="h-8 px-3"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </GlowCard>
              ))}
              {recipeIngredients.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No ingredients found from recipes</p>
                </Card>
              )}
            </div>
          </div>
        )}
        {activeTab === 'final' && (
          <div className="space-y-6">

            {/* Meal Plan Ingredients Grouped by Recipe */}
            {(() => {
              const mealGroups = items.filter(item => item.source === 'mealplan')
                .reduce((groups, item) => {
                  const key = `${item.recipeName} (${item.day} • ${item.mealTime})`;
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(item);
                  return groups;
                }, {} as Record<string, typeof items>);
              
              return Object.entries(mealGroups).map(([groupName, groupItems]) => (
                <div key={groupName} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-primary">{groupName}</h3>
                  <div className="space-y-3">
                    {groupItems.map((item, idx) => (
                      <GlowCard key={item.id} className="p-4 animate-fade-up bg-card border-primary/20 hover:shadow-md" 
                            style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="data-[state=checked]:bg-primary"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                </div>
              ));
            })()
            }
            
            {/* Other Shopping Items */}
            {(() => {
              const otherItems = items.filter(item => item.source !== 'mealplan');
              return otherItems.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Other Items</h3>
                  <div className="space-y-3">
                    {otherItems.map((item, idx) => (
                      <GlowCard key={item.id} className="p-4 animate-fade-up bg-card hover:shadow-md" 
                            style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="data-[state=checked]:bg-primary"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
            
            {/* Recent Items Section */}
            {recentItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Items</h3>
                <div className="space-y-2">
                  {recentItems.map((item, idx) => (
                    <GlowCard key={item.id} className="p-3 animate-fade-up bg-card hover:shadow-md" 
                          style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.item_name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addRecentItem(item)}
                            className="h-8 px-3"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteRecentItem(item.id)}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Stats - Only show when not in 'all' tab */}
        {activeTab !== 'all' && (
          <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Items Left</p>
                <p className="text-2xl font-bold text-primary">
                  {items.filter(i => !i.checked).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {items.filter(i => i.checked).length}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* WhatsApp Share Button - Shows when items are checked */}
        {activeTab === 'final' && checkedItemsCount > 0 && (
          <div className="fixed bottom-24 right-4 z-50">
            <Button 
              onClick={shareToWhatsApp}
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Action Buttons - Only show in final tab */}
        {activeTab === 'final' && (
          <div className="space-y-3 mt-6">
            <Button 
              onClick={() => {
                console.log('=== REFRESH BUTTON CLICKED ===');
                console.log('Current items before refresh:', items);
                console.log('Current mealPlan:', mealPlan);
                console.log('Tuesday meals detailed:', mealPlan.Tuesday);
                console.log('Current recipes:', recipes);
                
                // Log each Tuesday meal in detail
                if (mealPlan.Tuesday) {
                  mealPlan.Tuesday.forEach((meal, index) => {
                    console.log(`Tuesday meal ${index}:`, meal);
                  });
                }
                
                // Clear existing meal plan items first
                setItems(prev => prev.filter(item => item.source !== 'mealplan'));
                
                // Then reload meal ingredients
                loadMealIngredients();
                
                toast({
                  title: "Refreshed",
                  description: "Shopping list updated with latest meals",
                });
              }}
              variant="outline"
              className="w-full h-12 gap-2"
            >
              Refresh Meal Ingredients
            </Button>
            
            <Button 
              className={`w-full h-12 gap-2 ${
                items.filter(i => !i.checked).length === 0 && items.length > 0
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={handleDone}
              disabled={items.filter(i => !i.checked).length > 0 || items.length === 0}
            >
              <Check className="w-5 h-5" />
              Done
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 gap-2">
                  <Plus className="w-5 h-5" />
                  Add Item Manually
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      placeholder="e.g., Chicken Breast"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-category">Category</Label>
                    <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                      <SelectTrigger id="item-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meat">Meat</SelectItem>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Pantry">Pantry</SelectItem>
                        <SelectItem value="Pasta">Pasta</SelectItem>
                        <SelectItem value="Beverages">Beverages</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <LoadingButton 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300" 
                    onClick={addItem}
                    loading={addItemLoading}
                    loadingText="Adding..."
                  >
                    Add to List
                  </LoadingButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
