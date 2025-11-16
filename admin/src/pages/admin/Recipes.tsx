import { useState, useEffect } from "react";
import { adminApiService } from "@/services/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Trash2, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import quinoaBowl from "@/assets/quinoa-bowl.jpg";
import grilledSalmon from "@/assets/grilled-salmon.jpg";
import overnightOats from "@/assets/overnight-oats.jpg";
import thaiCurry from "@/assets/thai-curry.jpg";
import caesarSalad from "@/assets/caesar-salad.jpg";

const Recipes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any>(null);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const response = await adminApiService.getAdminRecipes();
      setRecipes(response.recipes || []);
    } catch (error) {
      console.log('Failed to load admin recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (formData: any) => {
    try {
      if (editingRecipe) {
        // Update existing recipe
        const response = await adminApiService.updateAdminRecipe(editingRecipe.id, formData);
        setRecipes(recipes.map(r => r.id === editingRecipe.id ? { ...r, ...formData } : r));
        toast({ title: "Recipe Updated", description: "Recipe updated and synced to meal plan apps" });
      } else {
        // Create new recipe
        const response = await adminApiService.createAdminRecipe(formData);
        setRecipes([...recipes, { 
          id: response.recipe.id, 
          ...formData, 
          image: formData.image || quinoaBowl 
        }]);
        toast({ title: "Recipe Created", description: "Recipe created and synced to meal plan apps" });
      }
    } catch (error) {
      // Fallback to local state update
      if (editingRecipe) {
        setRecipes(recipes.map(r => r.id === editingRecipe.id ? { ...r, ...formData } : r));
        toast({ title: "Recipe Updated", description: "Recipe updated locally" });
      } else {
        setRecipes([...recipes, { 
          id: Date.now(), 
          ...formData, 
          image: formData.image || quinoaBowl 
        }]);
        toast({ title: "Recipe Created", description: "Recipe created locally" });
      }
    }
    setOpenDialog(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = async (id: number) => {
    try {
      await adminApiService.deleteAdminRecipe(String(id));
      setRecipes(recipes.filter(r => r.id !== id));
      toast({ title: "Recipe Deleted", description: "Recipe removed and synced to meal plan apps" });
    } catch (error) {
      // Fallback to local state update
      setRecipes(recipes.filter(r => r.id !== id));
      toast({ title: "Recipe Deleted", description: "Recipe removed locally" });
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Recipe Library</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage recipes, templates, and meal plans</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setEditingRecipe(null)}>
              <Plus className="h-4 w-4" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <RecipeForm recipe={editingRecipe} onSave={handleSaveRecipe} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">{recipe.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="flex flex-wrap gap-2">

                    <Badge
                      className="text-xs"
                      variant={
                        recipe.difficulty === "Easy"
                          ? "default"
                          : recipe.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 md:h-4 md:w-4" />
                      {recipe.servings} servings
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge 
                      variant={recipe.status === "Published" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {recipe.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Dialog open={openDialog && editingRecipe?.id === recipe.id} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingRecipe(recipe)}>
                            <Edit className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <RecipeForm recipe={recipe} onSave={handleSaveRecipe} />
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteRecipe(recipe.id)}>
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RecipeForm = ({ recipe, onSave }: { recipe: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",

    difficulty: recipe?.difficulty || "Easy",
    cookTime: recipe?.cookTime || "",
    servings: recipe?.servings || 1,
    status: recipe?.status || "Draft",
    author: recipe?.author || "",
    ingredients: recipe?.ingredients || [""],
    instructions: recipe?.instructions || [""]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateArrayField = (field: string, index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: string) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData({ ...formData, [field]: formData[field].filter((_: any, i: number) => i !== index) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{recipe ? "Edit Recipe" : "Create Recipe"}</DialogTitle>
        <DialogDescription>
          {recipe ? "Update recipe details" : "Add a new recipe with ingredients and instructions"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Recipe Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cookTime">Cook Time</Label>
            <Input
              id="cookTime"
              placeholder="30 min"
              value={formData.cookTime}
              onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Ingredients</Label>
          {formData.ingredients.map((ingredient: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={ingredient}
                onChange={(e) => updateArrayField('ingredients', index, e.target.value)}
                placeholder="1 cup flour"
                required
              />
              {formData.ingredients.length > 1 && (
                <Button type="button" size="icon" variant="ghost" onClick={() => removeArrayField('ingredients', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('ingredients')} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Instructions</Label>
          {formData.instructions.map((instruction: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={instruction}
                onChange={(e) => updateArrayField('instructions', index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                required
                rows={2}
              />
              {formData.instructions.length > 1 && (
                <Button type="button" size="icon" variant="ghost" onClick={() => removeArrayField('instructions', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('instructions')} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{recipe ? "Update" : "Create"} Recipe</Button>
      </DialogFooter>
    </form>
  );
};

export default Recipes;
