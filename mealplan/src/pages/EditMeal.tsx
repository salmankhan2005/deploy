import { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/utils/security';
import { useDiscoverRecipes } from '@/hooks/useDiscoverRecipes';

export const EditMeal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToMealPlan } = useMealPlan();
  
  const day = searchParams.get('day') || '';
  const mealTime = searchParams.get('mealTime') || '';
  const currentMeal = searchParams.get('currentMeal') || '';
  const week = searchParams.get('week') || 'Week - 1';
  
  const [mealName, setMealName] = useState(currentMeal);
  const [searchQuery, setSearchQuery] = useState('');
  const { allRecipes, loading } = useDiscoverRecipes();
  
  const mealSuggestions = {
    'Breakfast': ['Tea', 'Coffee', 'Sandwich', 'Milk', 'Toast', 'Cereal'],
    'Lunch': ['Briyani', 'Rice', 'Onion raita', 'Curry', 'Salad', 'Soup'],
    'Dinner': ['Chapati', 'Dal kuruma', 'Vegetable curry', 'Rice', 'Roti'],
    'Snack': ['Biscuits', 'Fruits', 'Nuts', 'Juice', 'Chips']
  };
  
  const [availableSuggestions, setAvailableSuggestions] = useState(() => {
    const deletedItems = JSON.parse(localStorage.getItem('deletedMealSuggestions') || '[]');
    const allSuggestions = mealSuggestions[mealTime as keyof typeof mealSuggestions] || [];
    return allSuggestions.filter(item => !deletedItems.includes(item));
  });
  
  // Memoized combined suggestions
  const combinedSuggestions = useMemo(() => [
    ...availableSuggestions,
    ...allRecipes.map(recipe => recipe.name)
  ], [availableSuggestions, allRecipes]);
  
  const filteredSuggestions = useMemo(() => 
    combinedSuggestions.filter(meal => 
      meal.toLowerCase().includes(searchQuery.toLowerCase())
    ), [combinedSuggestions, searchQuery]
  );

  const handleAdd = useCallback(async () => {
    if (!mealName.trim()) {
      toast.error('Please enter a meal name');
      return;
    }

    try {
      await addToMealPlan({
        recipeId: `meal-${Date.now()}`,
        recipeName: sanitizeHtml(mealName.trim()),
        day: day,
        mealTime: mealTime,
        servings: 1,
        image: '🍽️',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        week: week
      });

      toast.success('Meal updated successfully');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to update meal');
    }
  }, [mealName, addToMealPlan, day, mealTime, week, navigate]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setMealName(prev => prev.trim() ? prev + ', ' + suggestion : suggestion);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={`${day} / ${mealTime}`}
        showBackButton={true}
        onBackClick={() => navigate('/home')}
      />
      
      <main className="container-responsive py-6 space-y-6">
        <div>
          <Label htmlFor="meal-name">Meal Name</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="meal-name"
              placeholder="e.g., Coffee with toasts"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAdd} className="px-6">
              Add
            </Button>
          </div>
        </div>
        
        <div className="border-2 border-primary rounded-lg p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading recipes...</div>
            ) : (
              filteredSuggestions.map((meal, idx) => {
                const isLocalSuggestion = availableSuggestions.includes(meal);
                return (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 rounded cursor-pointer border border-border"
                    onClick={() => handleSuggestionClick(meal)}
                  >
                    <span className="text-foreground font-medium">{meal}</span>
                    {isLocalSuggestion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          const deletedItems = JSON.parse(localStorage.getItem('deletedMealSuggestions') || '[]');
                          const updatedDeleted = [...deletedItems, meal];
                          localStorage.setItem('deletedMealSuggestions', JSON.stringify(updatedDeleted));
                          setAvailableSuggestions(prev => prev.filter(item => item !== meal));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};