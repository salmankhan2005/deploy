import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Clock, Users, Heart, Share, Plus, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSavedRecipes } from '@/contexts/SavedRecipesContext';
import { useRecipeContext } from '@/contexts/RecipeContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { StarRating } from '@/components/StarRating';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { TTSService } from '@/utils/textToSpeech';

const recipeData = {
  1: {
    id: 1, name: 'Avocado Toast', image: '🥑', time: '5 min', servings: 1, category: 'Breakfast',
    ingredients: ['2 slices whole grain bread', '1 ripe avocado', 'Salt and pepper', 'Lemon juice', 'Red pepper flakes'],
    instructions: ['Toast bread slices', 'Mash avocado with salt, pepper, and lemon juice', 'Spread avocado on toast', 'Sprinkle with red pepper flakes']
  },
  2: {
    id: 2, name: 'Greek Yogurt Bowl', image: '🥣', time: '3 min', servings: 1, category: 'Breakfast',
    ingredients: ['1 cup Greek yogurt', '1/4 cup granola', '1/2 cup mixed berries', '1 tbsp honey', 'Chia seeds'],
    instructions: ['Add yogurt to bowl', 'Top with granola and berries', 'Drizzle with honey', 'Sprinkle chia seeds on top']
  },
  3: {
    id: 3, name: 'Grilled Chicken Salad', image: '🥗', time: '20 min', servings: 2, category: 'Lunch',
    ingredients: ['2 chicken breasts', 'Mixed salad greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil & lemon juice'],
    instructions: ['Season chicken with salt and pepper', 'Grill chicken for 6-7 minutes per side', 'Prepare salad with greens, tomatoes, and cucumber', 'Slice chicken and serve over salad with dressing']
  },
  4: {
    id: 4, name: 'Quinoa Buddha Bowl', image: '🍲', time: '25 min', servings: 2, category: 'Lunch',
    ingredients: ['1 cup quinoa', 'Roasted vegetables', 'Chickpeas', 'Avocado', 'Tahini dressing'],
    instructions: ['Cook quinoa according to package directions', 'Roast vegetables in oven', 'Arrange quinoa, vegetables, and chickpeas in bowl', 'Top with avocado and tahini dressing']
  },
  5: {
    id: 5, name: 'Salmon with Vegetables', image: '🐟', time: '30 min', servings: 2, category: 'Dinner',
    ingredients: ['2 salmon fillets', 'Broccoli', 'Carrots', 'Olive oil', 'Garlic and herbs'],
    instructions: ['Preheat oven to 400°F', 'Season salmon with herbs', 'Toss vegetables with olive oil and garlic', 'Bake salmon and vegetables for 20 minutes']
  },
  6: {
    id: 6, name: 'Pasta Primavera', image: '🍝', time: '25 min', servings: 3, category: 'Dinner',
    ingredients: ['12 oz pasta', 'Mixed vegetables', 'Garlic', 'Olive oil', 'Parmesan cheese'],
    instructions: ['Cook pasta according to package directions', 'Sauté vegetables with garlic in olive oil', 'Toss pasta with vegetables', 'Serve with Parmesan cheese']
  }
};

export const RecipeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { savedRecipes, isRecipeSaved, saveRecipe, unsaveRecipe } = useSavedRecipes();
  const { recipes: userRecipes, getRecipe } = useRecipeContext();
  const { getRecipeReviews, getAverageRating, addReview } = useReviews();
  const { isAuthenticated } = useAuth();
  const { addToMealPlan } = useMealPlan();
  const [addToMealPlanOpen, setAddToMealPlanOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [dbRecipe, setDbRecipe] = useState(null);
  const [discoverRecipe, setDiscoverRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  
  const recipeId = parseInt(id || '0');
  const recipeReviews = getRecipeReviews(recipeId);
  const averageRating = getAverageRating(recipeId);
  
  useEffect(() => {
    loadRecipeDetails();
  }, [id, isAuthenticated]);
  
  const loadRecipeDetails = async () => {
    let foundRecipe = null;
    
    // Check user created recipes first (from RecipeContext)
    const userRecipe = userRecipes.find(r => r.id?.toString() === id);
    if (userRecipe) {
      foundRecipe = {
        ...userRecipe,
        name: userRecipe.title || userRecipe.name,
        time: userRecipe.cook_time ? `${userRecipe.cook_time} min` : '30 min'
      };
      setDiscoverRecipe(foundRecipe);
    }
    
    // Check localStorage for other recipes
    if (!foundRecipe) {
      try {
        const guestDiscoverRecipes = localStorage.getItem('guest_discover_recipes');
        const savedRecipes = localStorage.getItem('savedRecipes');
        
        if (guestDiscoverRecipes) {
          const discoverRecipes = JSON.parse(guestDiscoverRecipes);
          foundRecipe = discoverRecipes.find(r => r.id.toString() === id);
        }
        
        if (!foundRecipe && savedRecipes) {
          const recipes = JSON.parse(savedRecipes);
          foundRecipe = recipes.find(r => r.id.toString() === id);
        }
        
        if (foundRecipe) {
          setDiscoverRecipe(foundRecipe);
        }
      } catch (error) {
        console.log('Error loading from localStorage:', error);
      }
    }
    
    // Try database if authenticated and not found locally
    if (!foundRecipe && isAuthenticated && id) {
      try {
        const response = await apiService.getRecipeDetails(id);
        if (response.recipe) {
          setDbRecipe(response.recipe);
          foundRecipe = response.recipe;
        }
      } catch (error) {
        console.log('Recipe not found in database');
      }
    }
    
    // Try discover recipes API as last resort
    if (!foundRecipe) {
      try {
        const discoverResponse = await apiService.getDiscoverRecipes();
        foundRecipe = discoverResponse.recipes?.find(r => r.id.toString() === id);
        if (foundRecipe) {
          setDiscoverRecipe(foundRecipe);
        }
      } catch (error) {
        console.log('Failed to load from API');
      }
    }
    
    setLoading(false);
  };
  
  // Try database recipe first, then discover recipe, then static data, then saved recipes
  const recipe = dbRecipe || discoverRecipe || recipeData[recipeId as keyof typeof recipeData] || savedRecipes.find(r => r.id === recipeId);
  const isSaved = isRecipeSaved(recipeId);
  
  const handleSaveToggle = () => {
    if (!recipe) return;
    if (isSaved) {
      unsaveRecipe(recipe.id);
      toast.success('Recipe removed from saved');
    } else {
      saveRecipe(recipe);
      toast.success('Recipe saved!');
    }
  };
  
  const handleAddToMealPlan = async () => {
    if (!selectedDay || !selectedMealTime || !recipe) {
      toast.error('Please select day and meal time');
      return;
    }
    
    try {
      await addToMealPlan({
        recipeId: recipe.id,
        recipeName: recipe.name,
        day: selectedDay,
        mealTime: selectedMealTime,
        servings: recipe.servings,
        image: recipe.image,
        time: recipe.time
      });
      
      toast.success(`Added ${recipe.name} to ${selectedDay} ${selectedMealTime}`);
      setAddToMealPlanOpen(false);
      setSelectedDay('');
      setSelectedMealTime('');
    } catch (error) {
      toast.error('Failed to add to meal plan');
    }
  };
  
  const handleAddReview = () => {
    if (newRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    addReview(recipeId, newRating, newReview);
    toast.success('Review added successfully!');
    setReviewDialogOpen(false);
    setNewRating(0);
    setNewReview('');
  };

  const handleSpeakInstructions = async () => {
    if (isSpeaking) {
      await TTSService.stop();
      setIsSpeaking(false);
      setCurrentStep(-1);
      return;
    }

    if (!recipe?.instructions) return;

    // Request permissions first
    const hasPermission = await TTSService.requestPermissions();
    if (!hasPermission) {
      toast.error('Text-to-speech not available on this device');
      return;
    }

    setIsSpeaking(true);
    const instructions = recipe.instructions;
    
    try {
      await TTSService.speak(`Starting recipe instructions for ${recipe.name}`);
      
      for (let i = 0; i < instructions.length; i++) {
        if (!isSpeaking) break; // Check if user stopped
        setCurrentStep(i);
        await TTSService.speak(`Step ${i + 1}. ${instructions[i]}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between steps
      }
      
      if (isSpeaking) {
        await TTSService.speak('Recipe instructions complete. Enjoy your meal!');
      }
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Failed to read instructions aloud');
    } finally {
      setIsSpeaking(false);
      setCurrentStep(-1);
    }
  };

  const handleSpeakStep = async (stepIndex: number, instruction: string) => {
    try {
      const hasPermission = await TTSService.requestPermissions();
      if (!hasPermission) {
        toast.error('Text-to-speech not available');
        return;
      }
      await TTSService.speak(`Step ${stepIndex + 1}. ${instruction}`);
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Failed to read step aloud');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Recipe not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title={window.location.pathname.includes('/discover') || document.referrer.includes('/discover') ? 'Discover' : 'Recipe Details'} 
        showNotifications={false} 
      />
      
      <main>
        {/* Hero Image */}
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 bg-muted mb-4 sm:mb-6">
          <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
            {recipe.image}
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-background/80 backdrop-blur-sm h-9 w-9 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-background/80 backdrop-blur-sm h-9 w-9 sm:h-10 sm:w-10"
              onClick={handleSaveToggle}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm h-9 w-9 sm:h-10 sm:w-10">
              <Share className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        <div className="px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3 sm:mb-4">
            {recipe.name}
          </h1>

          <div className="flex gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold">Instructions</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSpeakInstructions}
                className="flex items-center gap-2"
              >
                {isSpeaking ? (
                  <><VolumeX className="w-4 h-4" /> Stop</>
                ) : (
                  <><Volume2 className="w-4 h-4" /> Read Aloud</>
                )}
              </Button>
            </div>
            <ol className="space-y-4">
              {recipe.instructions?.map((instruction, index) => (
                <li key={index} className={`flex gap-3 p-3 rounded-lg transition-colors ${
                  currentStep === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                }`}>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === index ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p>{instruction}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeakStep(index, instruction)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ol>
          </Card>

          <div className="flex gap-3 mb-6">
            <Button className="flex-1 h-12" onClick={() => setAddToMealPlanOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add to Meal Plan
            </Button>
            <Button variant="outline" className="flex-1 h-12" onClick={() => setReviewDialogOpen(true)}>
              <Heart className="w-5 h-5 mr-2" />
              Add Review
            </Button>
          </div>
          
          {/* Reviews Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(averageRating)} readonly size="sm" />
                <span className="text-sm text-muted-foreground">
                  ({recipeReviews.length} reviews)
                </span>
              </div>
            </div>
            
            {recipeReviews.length > 0 ? (
              <div className="space-y-4">
                {recipeReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        <StarRating rating={review.rating} readonly size="sm" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No reviews yet. Be the first to review this recipe!
              </p>
            )}
          </Card>
          
          {/* Add to Meal Plan Dialog */}
          <Dialog open={addToMealPlanOpen} onOpenChange={setAddToMealPlanOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Meal Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Day</label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Meal Time</label>
                  <Select value={selectedMealTime} onValueChange={setSelectedMealTime}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select meal time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddToMealPlan} className="w-full">
                  Add to Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Add Review Dialog */}
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate & Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Rating</Label>
                  <div className="mt-2">
                    <StarRating rating={newRating} onRatingChange={setNewRating} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">Review (Optional)</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your thoughts about this recipe..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddReview} className="w-full">
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
