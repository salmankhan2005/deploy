import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChefHat, Clock, Download, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mealPlanSyncService, AdminMealPlan } from '@/services/mealPlanSync';
import { useAuth } from '@/contexts/AuthContext';

const MealPlanTemplates = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<AdminMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminMealPlan | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [targetWeek, setTargetWeek] = useState('Week - 1');
  const [applying, setApplying] = useState(false);

  const weeks = ['Week - 1', 'Week - 2', 'Week - 3', 'Week - 4'];

  useEffect(() => {
    loadTemplates();
    
    // Set up polling to check for template updates every 30 seconds
    const interval = setInterval(() => {
      loadTemplates();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTemplates = async () => {
    try {
      const adminTemplates = await mealPlanSyncService.getAdminTemplates();
      setTemplates(adminTemplates);
      console.log('Templates loaded:', adminTemplates.length);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const getMealCount = (meals: Record<string, Record<string, any>>) => {
    let count = 0;
    Object.values(meals).forEach((dayMeals) => {
      if (dayMeals && typeof dayMeals === 'object') {
        count += Object.keys(dayMeals).length;
      }
    });
    return count;
  };

  const getDayCount = (meals: Record<string, Record<string, any>>) => {
    return Object.keys(meals).length;
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;
    
    setApplying(true);
    try {
      const success = await mealPlanSyncService.applyTemplate(selectedTemplate.id, targetWeek);
      
      if (success) {
        toast.success(`Template "${selectedTemplate.name}" applied to ${targetWeek}!`);
        setApplyDialogOpen(false);
        setSelectedTemplate(null);
        // Navigate to home to see the applied plan
        navigate('/');
      } else {
        toast.error('Failed to apply template. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to apply template. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const openApplyDialog = (template: AdminMealPlan) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to apply meal plan templates');
      navigate('/auth');
      return;
    }
    
    setSelectedTemplate(template);
    setApplyDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title="Meal Plan Templates" showBackButton onBackClick={() => navigate(-1)} />
        <main className="container-responsive py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Meal Plan Templates" showBackButton onBackClick={() => navigate(-1)} />
      
      <main className="container-responsive py-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Admin Curated Meal Plans</h2>
          <p className="text-muted-foreground">
            Choose from professionally designed meal plans and apply them to your weekly schedule
          </p>
          <p className="text-xs text-muted-foreground">
            Templates update automatically when admins make changes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{getDayCount(template.meals)} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-muted-foreground" />
                    <span>{getMealCount(template.meals)} meals</span>
                  </div>
                </div>

                {/* Preview of meals */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sample Meals:</h4>
                  <div className="space-y-1">
                    {Object.entries(template.meals).slice(0, 2).map(([day, dayMeals]) => (
                      <div key={day} className="text-xs text-muted-foreground">
                        <span className="font-medium">{day}:</span>
                        {Object.entries(dayMeals).slice(0, 2).map(([mealTime, mealData]: [string, any]) => (
                          <span key={mealTime} className="ml-2">
                            {mealData.recipe_name}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => openApplyDialog(template)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Apply Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Templates Available</h3>
              <p className="text-muted-foreground">
                Check back later for new meal plan templates from our admin team.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Apply Template Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Meal Plan Template</DialogTitle>
            <DialogDescription>
              Apply "{selectedTemplate?.name}" to your meal plan. This will replace existing meals for the selected week.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Week</label>
              <Select value={targetWeek} onValueChange={setTargetWeek}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weeks.map((week) => (
                    <SelectItem key={week} value={week}>{week}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTemplate && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Template Preview:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Days:</strong> {getDayCount(selectedTemplate.meals)}</p>
                  <p><strong>Total Meals:</strong> {getMealCount(selectedTemplate.meals)}</p>
                  <p><strong>Created by:</strong> {selectedTemplate.created_by}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyTemplate} disabled={applying}>
              {applying ? 'Applying...' : 'Apply Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default MealPlanTemplates;