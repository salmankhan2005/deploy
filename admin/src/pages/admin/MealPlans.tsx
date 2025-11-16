import { useState, useEffect } from "react";
import { adminApiService } from "@/services/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MealPlans = () => {
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
        { id: 1, name: "7-Day Keto Plan", duration: "7 days", type: "Keto", users: 234, status: "Active", createdBy: "Chef John" },
        { id: 2, name: "Mediterranean Weekly", duration: "7 days", type: "Mediterranean", users: 456, status: "Active", createdBy: "Chef Maria" },
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
        toast({ title: "Template Updated", description: "Meal plan template updated and synced to user apps" });
      } else {
        const response = await adminApiService.createAdminMealPlan(formData);
        setMealPlans([...mealPlans, response.meal_plan]);
        toast({ title: "Template Created", description: "Meal plan template created and available to users" });
      }
    } catch (error) {
      if (editingPlan) {
        setMealPlans(mealPlans.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
        toast({ title: "Template Updated", description: "Template updated locally" });
      } else {
        setMealPlans([...mealPlans, { id: Date.now(), ...formData, users: 0, createdBy: "Admin" }]);
        toast({ title: "Template Created", description: "Template created locally" });
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Meal Plan Templates</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Create templates that users can apply to their meal plans</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setEditingPlan(null)}>
              <Plus className="h-4 w-4" />
              Create Meal Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <MealPlanForm plan={editingPlan} onSave={handleSavePlan} />
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
              <Card key={plan.id} className="">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">by {plan.createdBy}</p>
                    </div>
                    <Badge variant={plan.status === "Active" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">{plan.type}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {plan.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {plan.users} users
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog open={openDialog && editingPlan?.id === plan.id} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingPlan(plan)}>
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <MealPlanForm plan={plan} onSave={handleSavePlan} />
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

const MealPlanForm = ({ plan, onSave }: { plan: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    type: plan?.type || "Balanced",
    status: plan?.status || "Active",
    meals: plan?.meals || {
      Monday: { Breakfast: { recipe_name: "", servings: 1, image: "🍽️" } },
      Tuesday: { Breakfast: { recipe_name: "", servings: 1, image: "🍽️" } }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const templateData = {
      ...formData,
      week_start: '2024-01-01',
      created_by: 'Admin',
      is_admin_template: true
    };
    onSave(templateData);
  };

  const addMealDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDays = Object.keys(formData.meals);
    const nextDay = days.find(day => !currentDays.includes(day));
    if (nextDay) {
      setFormData({
        ...formData,
        meals: {
          ...formData.meals,
          [nextDay]: { Breakfast: { recipe_name: "", servings: 1, image: "🍽️" } }
        }
      });
    }
  };

  const updateMeal = (day: string, mealTime: string, field: string, value: any) => {
    setFormData({
      ...formData,
      meals: {
        ...formData.meals,
        [day]: {
          ...formData.meals[day],
          [mealTime]: {
            ...formData.meals[day][mealTime],
            [field]: value
          }
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{plan ? "Edit Meal Plan Template" : "Create Meal Plan Template"}</DialogTitle>
        <DialogDescription>
          {plan ? "Update template that users can apply" : "Create a template that users can apply to their meal plans"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="7-Day Mediterranean Plan"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Healthy Mediterranean diet with fresh ingredients"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Plan Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Balanced">Balanced</SelectItem>
              <SelectItem value="Keto">Keto</SelectItem>
              <SelectItem value="Mediterranean">Mediterranean</SelectItem>
              <SelectItem value="Vegan">Vegan</SelectItem>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Low-Carb">Low-Carb</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Meals</Label>
            <Button type="button" size="sm" onClick={addMealDay}>Add Day</Button>
          </div>
          {Object.entries(formData.meals).map(([day, dayMeals]) => (
            <div key={day} className="border rounded p-3 space-y-2">
              <h4 className="font-medium">{day}</h4>
              {Object.entries(dayMeals).map(([mealTime, mealData]: [string, any]) => (
                <div key={mealTime} className="grid grid-cols-3 gap-2 text-sm">
                  <Input
                    placeholder={mealTime}
                    value={mealData.recipe_name}
                    onChange={(e) => updateMeal(day, mealTime, 'recipe_name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Servings"
                    value={mealData.servings}
                    onChange={(e) => updateMeal(day, mealTime, 'servings', parseInt(e.target.value) || 1)}
                  />
                  <Input
                    placeholder="🍽️"
                    value={mealData.image}
                    onChange={(e) => updateMeal(day, mealTime, 'image', e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{plan ? "Update" : "Create"} Template</Button>
      </DialogFooter>
    </form>
  );
};

export default MealPlans;
