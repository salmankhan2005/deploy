import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Clock, Users, BookmarkX, CalendarPlus, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSavedRecipes } from '@/contexts/SavedRecipesContext';
import { useRecipeContext } from '@/contexts/RecipeContext';
import { useToast } from '@/hooks/use-toast';
import { LottieAnimation } from '@/components/LottieAnimation';
import { GlowCard } from '@/components/GlowCard';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { useUserData } from '@/contexts/UserDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDiscoverRecipes } from '@/hooks/useDiscoverRecipes';



// Admin Recipes Component
const AdminRecipesSection = () => {
  const [adminRecipes, setAdminRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAdminRecipes();
  }, []);

  const loadAdminRecipes = async () => {
    try {
      const response = await apiService.getAdminRecipes();
      setAdminRecipes(response.recipes || []);
    } catch (error) {
      // Silently handle connection errors - backend may not be running
      setAdminRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || adminRecipes.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 mt-12">
      <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold mb-3 sm:mb-4">
        Admin Recipes ({adminRecipes.length})
      </h3>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminRecipes.map((recipe, idx) => (
          <GlowCard
            key={`admin-${recipe.id}-${idx}`}
            className="p-3 sm:p-4 hover:shadow-xl hover:-translate-y-2 animate-fade-up bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <Link to={`/recipe/${recipe.id}`} className="block">
              <div className="flex gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                  {recipe.image || '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 line-clamp-2">{recipe.name || recipe.title}</h4>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.time || `${recipe.cook_time || 30} min`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recipe.servings} servings
                    </span>
                  </div>

                </div>
              </div>
            </Link>
          </GlowCard>
        ))}
      </div>
    </div>
  );
};

export const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dbSavedRecipes, setDbSavedRecipes] = useState<any[]>([]);
  const { recipes: userRecipes, fetchRecipes } = useRecipeContext();
  const { allRecipes: discoverRecipes } = useDiscoverRecipes();
  const [loading, setLoading] = useState(true);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [showSearchSignInNotification, setShowSearchSignInNotification] = useState(false);
  const [showGuestNotification, setShowGuestNotification] = useState(true);
  const { savedRecipes, unsaveRecipe } = useSavedRecipes();
  const { isAuthenticated, isGuest } = useAuth();
  const { addToMealPlan, currentWeek } = useMealPlan();
  const { preferences } = useUserData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTimes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedRecipes();
      fetchRecipes();
    }
    setLoading(false);
    
    // Set up polling for admin recipe updates (only if authenticated)
    let interval;
    if (isAuthenticated) {
      interval = setInterval(async () => {
        try {
          const adminRecipes = await apiService.getAdminRecipes();
          // Update any admin recipes in the current view
          if (adminRecipes.recipes && adminRecipes.recipes.length > 0) {
            // This could trigger a re-render if admin recipes are displayed
          }
        } catch (error) {
          // Silently handle connection errors
        }
      }, 60000); // Poll every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, fetchRecipes]);

  const loadSavedRecipes = async () => {
    try {
      const response = await apiService.getSavedRecipesNew();
      setDbSavedRecipes(response.saved_recipes.map(item => ({
        id: item.recipe_id,
        name: item.recipe_data?.name || item.recipe_data?.title || item.recipe_name || 'Untitled Recipe',
        image: item.recipe_data?.image || '🍽️',
        time: item.recipe_data?.time || '30 min',
        servings: item.recipe_data?.servings || 1,
        category: item.recipe_data?.category || 'Other'
      })));
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };



  // Memoized searchable recipes - only admin recipes for recommended section
  const allSearchableRecipes = useMemo(() => [
    ...discoverRecipes.filter(recipe => recipe.is_admin_recipe || recipe.author === 'By Admin').map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      time: recipe.time,
      servings: recipe.servings,
      category: 'Admin Recommended'
    }))
  ].filter((recipe, index, self) => 
    index === self.findIndex(r => r.id === recipe.id)
  ), [discoverRecipes]);

  const filteredRelevantRecipes = useMemo(() => 
    allSearchableRecipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }), [allSearchableRecipes, searchQuery, selectedCategory]
  );

  // Combine database saved recipes with local saved recipes
  const allSavedRecipes = [...dbSavedRecipes, ...savedRecipes];
  
  // Remove duplicates based on ID
  const uniqueSavedRecipes = allSavedRecipes.filter((recipe, index, self) => 
    index === self.findIndex(r => r.id === recipe.id)
  );
  
  // Memoized filtered saved recipes
  const filteredSavedRecipes = useMemo(() => 
    uniqueSavedRecipes.filter((recipe) => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }), [uniqueSavedRecipes, searchQuery, selectedCategory]
  );

  const handleUnsave = async (recipeId: number | string, recipeName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isAuthenticated) {
        await apiService.unsaveRecipeNew(String(recipeId));
        // Remove from database saved recipes
        setDbSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      }
      
      // Also remove from local saved recipes
      unsaveRecipe(recipeId);
      
      toast({
        title: "Recipe removed",
        description: `${recipeName} removed from your recipes`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToMeal = useCallback((recipe: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedRecipe(recipe);
    setMealPlanDialog(true);
  }, []);

  const handleConfirmAddToMeal = async () => {
    if (!selectedRecipe || !selectedDay || !selectedMealTime) {
      toast({
        title: "Error",
        description: "Please select both day and meal time",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToMealPlan({
        recipeId: selectedRecipe.id,
        recipeName: selectedRecipe.name,
        day: selectedDay,
        mealTime: selectedMealTime,
        servings: selectedRecipe.servings || 1,
        image: selectedRecipe.image || '🍽️',
        time: selectedRecipe.time || '30 min',
        week: currentWeek || preferences.selectedWeek || 'Week - 1'
      });

      toast({
        title: "Added to meal plan",
        description: `${selectedRecipe.name} added to ${selectedDay} ${selectedMealTime}`,
      });

      setMealPlanDialog(false);
      setSelectedRecipe(null);
      setSelectedDay('');
      setSelectedMealTime('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-24">
      <Header 
        title="Recipes" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
        {/* Guest Mode Notification */}
        {isGuest && showGuestNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-lg max-w-sm mx-auto relative">
              <button 
                onClick={() => setShowGuestNotification(false)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-black font-bold hover:bg-orange-100 rounded-full"
              >
                ×
              </button>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-orange-600 text-sm">ℹ</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-orange-800">
                    You're in guest mode. Recipes will be saved locally on this device only. Sign in to save recipes to your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Bar, Refresh Button, and Create Recipe Button */}
        <div className="flex gap-3 mb-4 sm:mb-6 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => {
                if (!isGuest) {
                  setSearchQuery(e.target.value);
                }
              }}
              onClick={() => {
                if (isGuest) {
                  setShowSearchSignInNotification(true);
                  setTimeout(() => setShowSearchSignInNotification(false), 3000);
                }
              }}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
              readOnly={isGuest}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="h-10 sm:h-12 px-3 transition-colors"
            aria-label="Refresh page"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Link to="/recipe-builder">
            <Button variant="outline" className="h-10 sm:h-12 px-3 sm:px-4 flex items-center gap-2 hover:bg-primary/5 transition-colors whitespace-nowrap">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Create Recipe</span>
            </Button>
          </Link>
        </div>

        {/* Lottie Animation Display */}
        <div className="mb-8 sm:mb-12 flex justify-center px-4 py-6">
          <LottieAnimation className="w-48 h-32" />
        </div>

        {/* Admin Recipes Section */}
        <AdminRecipesSection />

        {/* My Recipes (Crafted Meals) */}
        {userRecipes.length > 0 && (
          <div className="mb-8 mt-12">
            <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold mb-3 sm:mb-4">
              My Recipes ({userRecipes.length})
            </h3>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userRecipes.map((recipe, idx) => (
                <GlowCard
                  key={`user-${recipe.id}-${idx}`}
                  className="p-3 sm:p-4 hover:shadow-xl hover:-translate-y-2 animate-fade-up bg-gradient-to-br from-card to-card/80"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <Link to={`/recipe/${recipe.id}`} className="block">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                        {recipe.image || '🍽️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 line-clamp-2">{recipe.title || 'Untitled Recipe'}</h4>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.cook_time ? `${recipe.cook_time} min` : '30 min'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {recipe.servings || 1} servings
                          </span>
                        </div>
                        <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-md">
                          My Recipe
                        </span>
                      </div>
                    </div>
                  </Link>
                </GlowCard>
              ))}
            </div>
          </div>
        )}

        {/* Saved Items */}
        <div className="mb-6 mt-8">
          <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold mb-3 sm:mb-4">
            Saved ({filteredSavedRecipes.length})
          </h3>
          {loading ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, idx) => (
                <Card key={idx} className="p-3 sm:p-4 animate-pulse">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-xl sm:rounded-2xl shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredSavedRecipes && filteredSavedRecipes.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSavedRecipes.map((recipe, idx) => (
                <GlowCard
                  key={`saved-${recipe.id}-${idx}`}
                  className="p-3 sm:p-4 hover:shadow-xl hover:-translate-y-2 animate-fade-up bg-gradient-to-br from-card to-card/80"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <Link to={`/recipe/${recipe.id}`} className="block">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                        {recipe.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 line-clamp-2">{recipe.name}</h4>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {recipe.servings} servings
                          </span>
                        </div>
                        <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                          Saved
                        </span>
                      </div>
                      <div className="flex items-start flex-col gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                          onClick={(e) => handleUnsave(recipe.id, recipe.name, e)}
                        >
                          <BookmarkX className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                          onClick={(e) => handleAddToMeal(recipe, e)}
                        >
                          <CalendarPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </GlowCard>
              ))}
            </div>
          ) : (
            <Card className="p-4 text-sm text-muted-foreground flex items-center gap-3">
              <LottieAnimation className="w-12 h-12" />
              <span>You don't have any saved recipes yet. Tap the bookmark icon on a recipe to save it here.</span>
            </Card>
          )}
        </div>

        {/* Recommended Recipes - Only show if there are discover recipes */}
        {filteredRelevantRecipes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold mb-3 sm:mb-4">
              Recommended Recipes
            </h3>
            {/* Category Filter - moved below Recommended Recipes heading */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Admin Recommended'].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRelevantRecipes.map((recipe, idx) => (
                <GlowCard 
                  key={`relevant-${recipe.id}-${idx}`}
                  className="p-3 sm:p-4 hover:shadow-xl hover:-translate-y-2 animate-fade-up bg-gradient-to-br from-card to-card/80" 
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <Link to={`/recipe/${recipe.id}`} className="block">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                        {recipe.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 line-clamp-2">{recipe.name}</h4>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {recipe.servings} servings
                          </span>
                        </div>

                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                        onClick={(e) => handleAddToMeal(recipe, e)}
                      >
                        <CalendarPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </Link>
                </GlowCard>
              ))}
            </div>
            
          </div>
        )}
      </main>

      <BottomNav />
      
      {/* Search Sign In Notification */}
      {showSearchSignInNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-up">
          <div className="bg-card border border-border rounded-lg p-4 shadow-lg mx-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Sign in to search recipes</span>
              </div>
              <Button
                size="sm"
                className="h-7 px-3 text-xs ml-4"
                onClick={() => {
                  setShowSearchSignInNotification(false);
                  navigate('/auth');
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Meal Plan Dialog */}
      <Dialog open={mealPlanDialog} onOpenChange={setMealPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRecipe && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="text-2xl">{selectedRecipe.image}</div>
                <div>
                  <h4 className="font-semibold">{selectedRecipe.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedRecipe.time} • {selectedRecipe.servings} servings</p>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="day-select">Select Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="meal-time-select">Select Meal Time</Label>
              <Select value={selectedMealTime} onValueChange={setSelectedMealTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose meal time" />
                </SelectTrigger>
                <SelectContent>
                  {mealTimes.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleConfirmAddToMeal} className="w-full">
              Add to Meal Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
