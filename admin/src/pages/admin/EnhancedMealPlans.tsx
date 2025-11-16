import { useState, useEffect } from "react";
import { adminApiService } from "@/services/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon, Users, Clock, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnhancedMealPlans = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    try {
      const response = await adminApiService.getAdminMealPlans();
      setMealPlans(response.meal_plans || []);
    } catch (error) {
      console.log('Using fallback meal plan data');
      setMealPlans([
        { 
          id: 1, 
          name: "7-Day Keto Plan", 
          description: "Low-carb ketogenic meal plan",
          week_start: "2024-01-01",
          status: "active", 
          created_by: "admin",
          meals: {
            Monday: {
              Breakfast: { recipe_name: "Keto Scrambled Eggs", servings: 1, image: "🍳" },
              Lunch: { recipe_name: "Avocado Salad", servings: 1, image: "🥗" },
              Dinner: { recipe_name: "Grilled Salmon", servings: 1, image: "🐟" }
            }
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (formData: any) => {
    try {
      if (editingPlan) {
        await adminApiService.updateAdminMealPlan(editingPlan.id, formData);
        setMealPlans(mealPlans.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
        toast({ title: "Meal Plan Updated", description: "Meal plan updated and synced to user apps" });
      } else {
        const response = await adminApiService.createAdminMealPlan(formData);
        setMealPlans([...mealPlans, response.meal_plan]);
        toast({ title: "Meal Plan Created", description: "Meal plan created and synced to user apps" });
      }
    } catch (error) {
      if (editingPlan) {
        setMealPlans(mealPlans.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
        toast({ title: "Meal Plan Updated", description: "Meal plan updated locally" });
      } else {
        setMealPlans([...mealPlans, { id: Date.now(), ...formData, created_by: "admin" }]);
        toast({ title: "Meal Plan Created", description: "Meal plan created locally" });
      }
    }
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await adminApiService.deleteAdminMealPlan(String(id));
      setMealPlans(mealPlans.filter(p => p.id !== id));
      toast({ title: "Meal Plan Deleted", description: "Meal plan removed and synced to user apps" });
    } catch (error) {
      setMealPlans(mealPlans.filter(p => p.id !== id));
      toast({ title: "Meal Plan Deleted", description: "Meal plan removed locally" });
    }
  };

  const filteredPlans = mealPlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMealCount = (meals: any) => {
    if (!meals) return 0;
    let count = 0;
    Object.values(meals).forEach((dayMeals: any) => {
      if (dayMeals && typeof dayMeals === 'object') {
        count += Object.keys(dayMeals).length;
      }
    });
    return count;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Enhanced Meal Plans</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Create detailed meal plan templates with sync to user apps</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setEditingPlan(null)}>
              <Plus className="h-4 w-4" />
              Create Meal Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <EnhancedMealPlanForm plan={editingPlan} onSave={handleSavePlan} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meal plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <p className="text-xs text-muted-foreground">by {plan.created_by}</p>
                    </div>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {plan.week_start ? new Date(plan.week_start).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      {getMealCount(plan.meals)} meals
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog open={openDialog && editingPlan?.id === plan.id} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingPlan(plan)}>
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <EnhancedMealPlanForm plan={plan} onSave={handleSavePlan} />
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" onClick={() => handleDeletePlan(plan.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
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

const EnhancedMealPlanForm = ({ plan, onSave }: { plan: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    week_start: plan?.week_start || new Date().toISOString().split('T')[0],
    status: plan?.status || "active",
    meals: plan?.meals || {}
  });

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMealTime, setSelectedMealTime] = useState("Breakfast");
  const [mealName, setMealName] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  const addMealToDay = () => {
    if (!mealName.trim()) return;
    
    const updatedMeals = { ...formData.meals };
    if (!updatedMeals[selectedDay]) {
      updatedMeals[selectedDay] = {};
    }
    updatedMeals[selectedDay][selectedMealTime] = {
      recipe_name: mealName,
      servings: 1,
      image: "🍽️"
    };
    
    setFormData({ ...formData, meals: updatedMeals });
    setMealName("");
  };

  const removeMealFromDay = (day: string, mealTime: string) => {
    const updatedMeals = { ...formData.meals };
    if (updatedMeals[day] && updatedMeals[day][mealTime]) {
      delete updatedMeals[day][mealTime];
      if (Object.keys(updatedMeals[day]).length === 0) {
        delete updatedMeals[day];
      }
    }
    setFormData({ ...formData, meals: updatedMeals });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{plan ? "Edit Meal Plan" : "Create Meal Plan"}</DialogTitle>
        <DialogDescription>
          {plan ? "Update meal plan details and meals" : "Create a new meal plan template with detailed meals"}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="7-Day Keto Plan"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="week_start">Week Start Date</Label>
            <Input
              id="week_start"
              type="date"
              value={formData.week_start}
              onChange={(e) => setFormData({ ...formData, week_start: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this meal plan..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meal Planning Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Plan Meals</h3>
          
          {/* Add Meal Form */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMealTime} onValueChange={setSelectedMealTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mealTimes.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Meal name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />
            
            <Button type="button" onClick={addMealToDay} size="sm">
              Add Meal
            </Button>
          </div>

          {/* Meals Display */}
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {daysOfWeek.map(day => (
              <div key={day} className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">{day}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {mealTimes.map(mealTime => {
                    const meal = formData.meals[day]?.[mealTime];
                    return (
                      <div key={mealTime} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <span className="text-sm font-medium">{mealTime}</span>
                          {meal && (
                            <p className="text-xs text-muted-foreground">{meal.recipe_name}</p>
                          )}
                        </div>
                        {meal && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMealFromDay(day, mealTime)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit">{plan ? "Update" : "Create"} Plan</Button>
      </DialogFooter>
    </form>
  );
};

export default EnhancedMealPlans;