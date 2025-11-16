import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Plus, Edit, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminApiService } from "@/services/adminApi";

const SubscriptionPlans = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadPlans();
  }, []);
  
  const loadPlans = async () => {
    try {
      const response = await adminApiService.getSubscriptionPlans();
      setPlans(response.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    interval: "month",
    features: ""
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planData = {
        name: formData.name,
        price: parseFloat(formData.price),
        interval: formData.interval,
        features: formData.features.split('\n').filter(f => f.trim())
      };
      
      await adminApiService.createSubscriptionPlan(planData);
      await loadPlans();
      setFormData({ name: "", price: "", interval: "month", features: "" });
      setOpenDialog(false);
      toast({ title: "Success", description: "Subscription plan created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create subscription plan" });
    }
  };
  
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      interval: plan.interval,
      features: plan.features.join('\n')
    });
    setOpenEditDialog(true);
  };
  
  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planData = {
        name: formData.name,
        price: parseFloat(formData.price),
        interval: formData.interval,
        features: formData.features.split('\n').filter(f => f.trim())
      };
      
      await adminApiService.updateSubscriptionPlan(editingPlan.id, planData);
      await loadPlans();
      setFormData({ name: "", price: "", interval: "month", features: "" });
      setOpenEditDialog(false);
      setEditingPlan(null);
      toast({ title: "Success", description: "Subscription plan updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update subscription plan" });
    }
  };
  
  const handleDeletePlan = async (planId: string) => {
    try {
      await adminApiService.deleteSubscriptionPlan(planId);
      await loadPlans();
      toast({ title: "Success", description: "Subscription plan deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete subscription plan" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">Manage subscription plans and pricing</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Create Plan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePlan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <Textarea
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Update Plan
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.name === "Premium" ? "border-primary" : ""}`}>
            {plan.name === "Premium" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
              </div>

            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditPlan(plan)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeletePlan(plan.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  );
};

export default SubscriptionPlans;