import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSavedRecipes } from '@/contexts/SavedRecipesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipeContext } from '@/contexts/RecipeContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService } from '@/services/api';

export const RecipeBuilder = () => {
  const navigate = useNavigate();
  const { createRecipe } = useRecipeContext();
  const { isAuthenticated, isGuest } = useAuth();
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  const addIngredient = () => setIngredients([...ingredients, '']);
  const addStep = () => setSteps([...steps, '']);
  
  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };
  
  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a recipe name');
      return;
    }

    // Filter out empty ingredients and steps
    const filteredIngredients = ingredients.filter(ing => ing.trim());
    const filteredSteps = steps.filter(step => step.trim());

    if (filteredIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    if (filteredSteps.length === 0) {
      toast.error('Please add at least one instruction step');
      return;
    }

    const newRecipe = {
      title: name.trim(),
      ingredients: filteredIngredients,
      instructions: filteredSteps,
      servings: parseInt(servings) || 1,
      cook_time: parseInt(time) || 30,
      difficulty: 'medium',
      image: '🍽️'
    };

    try {
      await createRecipe(newRecipe);
      toast.success(isGuest ? 'Recipe created and saved locally!' : 'Recipe created and saved to your account!');
      navigate('/discover');
    } catch (error) {
      toast.error('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6 sm:pb-8">
      <Header title="Create Recipe" showNotifications={false} showProfile={false} />
      
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-4xl mx-auto">
        {isGuest && (
          <Alert className="mb-4 border-amber-500 bg-amber-50 text-amber-800">
            <Info className="h-4 w-4 mr-2" />
            <AlertDescription>
              You're in guest mode. Recipes will be saved locally on this device only. Sign in to save recipes to your account.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="p-6 mb-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Recipe Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Grilled Chicken Salad" 
                className="mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Cooking Time</Label>
                <Input 
                  id="time" 
                  placeholder="e.g., 25 min" 
                  className="mt-1.5"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input 
                  id="servings" 
                  type="number" 
                  placeholder="e.g., 2" 
                  className="mt-1.5"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Ingredients</Label>
              <div className="space-y-2 mt-1.5">
                {ingredients.map((ingredient, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="e.g., 2 chicken breasts"
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[idx] = e.target.value;
                        setIngredients(newIngredients);
                      }}
                    />
                    {ingredients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
            </div>

            <div>
              <Label>Instructions</Label>
              <div className="space-y-2 mt-1.5">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                      {idx + 1}
                    </span>
                    <Textarea
                      placeholder="Describe this step..."
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[idx] = e.target.value;
                        setSteps(newSteps);
                      }}
                      className="flex-1"
                    />
                    {steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(idx)}
                        className="mt-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            {isGuest ? "Save Recipe Locally" : "Save Recipe"}
          </Button>
        </div>
      </main>
    </div>
  );
};
