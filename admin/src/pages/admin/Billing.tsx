import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, CreditCard, Download, Plus, Tag, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Billing = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SAVE20", discount: 20, type: "percentage", status: "Active", uses: 45 },
    { id: 2, code: "FIRST50", discount: 50, type: "percentage", status: "Active", uses: 123 },
    { id: 3, code: "FLAT10", discount: 10, type: "fixed", status: "Inactive", uses: 8 },
  ]);
  
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    { id: 1, name: "Basic", price: 9.99, features: ["5 meal plans", "Basic recipes"] },
    { id: 2, name: "Premium", price: 29.99, features: ["Unlimited plans", "All recipes", "Priority support"] },
  ]);

  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openPlanDialog, setOpenPlanDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleExportTransactions = () => {
    const csv = [
      ["Transaction ID", "User", "Plan", "Amount", "Status", "Date"],
      ...transactions.map(t => [t.id, t.user, t.plan, t.amount, t.status, t.date])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString()}.csv`;
    a.click();
    
    toast({
      title: "Export Successful",
      description: "Transactions exported to CSV file",
    });
  };

  const handleSaveCoupon = (formData: any) => {
    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...c, ...formData } : c));
      toast({ title: "Coupon Updated", description: "Coupon code updated successfully" });
    } else {
      setCoupons([...coupons, { id: Date.now(), ...formData, uses: 0 }]);
      toast({ title: "Coupon Created", description: "New coupon code created successfully" });
    }
    setOpenCouponDialog(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id: number) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast({ title: "Coupon Deleted", description: "Coupon code deleted successfully" });
  };

  const handleSavePlan = (formData: any) => {
    if (editingPlan) {
      setSubscriptionPlans(subscriptionPlans.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
      toast({ title: "Plan Updated", description: "Subscription plan updated successfully" });
    } else {
      setSubscriptionPlans([...subscriptionPlans, { id: Date.now(), ...formData }]);
      toast({ title: "Plan Created", description: "New subscription plan created successfully" });
    }
    setOpenPlanDialog(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: number) => {
    setSubscriptionPlans(subscriptionPlans.filter(p => p.id !== id));
    toast({ title: "Plan Deleted", description: "Subscription plan deleted successfully" });
  };

  const stats = [
    { label: "Total Revenue", value: "$54,230", change: "+8.2%", icon: DollarSign },
    { label: "Active Subscriptions", value: "8,234", change: "+5.7%", icon: TrendingUp },
    { label: "Transactions", value: "12,453", change: "+12.5%", icon: CreditCard },
  ];

  const transactions = [
    { id: "TXN001", user: "John Doe", plan: "Premium", amount: "$29.99", status: "Completed", date: "2024-03-15" },
    { id: "TXN002", user: "Jane Smith", plan: "Basic", amount: "$9.99", status: "Completed", date: "2024-03-14" },
    { id: "TXN003", user: "Mike Johnson", plan: "Premium", amount: "$29.99", status: "Failed", date: "2024-03-13" },
    { id: "TXN004", user: "Sarah Williams", plan: "Basic", amount: "$9.99", status: "Pending", date: "2024-03-12" },
    { id: "TXN005", user: "Tom Brown", plan: "Premium", amount: "$29.99", status: "Completed", date: "2024-03-11" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Billing & Payments</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Monitor revenue, subscriptions, and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold font-heading">{stat.value}</p>
                  <p className="text-xs md:text-sm text-primary mt-1">{stat.change}</p>
                </div>
                <div className="p-2 md:p-3 rounded-full bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coupon Codes Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="font-heading text-lg md:text-xl flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Coupon Codes
            </CardTitle>
            <Dialog open={openCouponDialog} onOpenChange={setOpenCouponDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setEditingCoupon(null)}>
                  <Plus className="h-4 w-4" />
                  Add Coupon
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CouponForm coupon={editingCoupon} onSave={handleSaveCoupon} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <code className="px-2 py-1 bg-muted rounded font-mono text-sm">{coupon.code}</code>
                    <Badge variant={coupon.status === "Active" ? "default" : "secondary"}>
                      {coupon.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {coupon.type === "percentage" ? `${coupon.discount}% off` : `$${coupon.discount} off`} • Used {coupon.uses} times
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setOpenCouponDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteCoupon(coupon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="font-heading text-lg md:text-xl">Subscription Plans</CardTitle>
            <Dialog open={openPlanDialog} onOpenChange={setOpenPlanDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setEditingPlan(null)}>
                  <Plus className="h-4 w-4" />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <PlanForm plan={editingPlan} onSave={handleSavePlan} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                      <p className="text-2xl font-bold text-primary">${plan.price}<span className="text-sm text-muted-foreground">/mo</span></p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingPlan(plan);
                          setOpenPlanDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="font-heading text-lg md:text-xl">Recent Transactions</CardTitle>
            <Button variant="outline" className="gap-2 w-full sm:w-auto" size="sm" onClick={handleExportTransactions}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {transactions.map((txn) => (
              <Card key={txn.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{txn.id}</p>
                      <p className="text-sm text-muted-foreground">{txn.user}</p>
                    </div>
                    <Badge
                      variant={
                        txn.status === "Completed"
                          ? "default"
                          : txn.status === "Failed"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {txn.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={txn.plan === "Premium" ? "default" : "secondary"} className="text-xs">
                      {txn.plan}
                    </Badge>
                    <p className="font-medium text-lg">{txn.amount}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>{txn.user}</TableCell>
                    <TableCell>
                      <Badge variant={txn.plan === "Premium" ? "default" : "secondary"}>
                        {txn.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{txn.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          txn.status === "Completed"
                            ? "default"
                            : txn.status === "Failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{txn.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CouponForm = ({ coupon, onSave }: { coupon: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState(coupon || {
    code: "",
    discount: 0,
    type: "percentage",
    status: "Active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{coupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
        <DialogDescription>
          {coupon ? "Update coupon code details" : "Add a new coupon code for discounts"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="code">Coupon Code</Label>
          <Input
            id="code"
            placeholder="SAVE20"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Amount</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Discount Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{coupon ? "Update" : "Create"} Coupon</Button>
      </DialogFooter>
    </form>
  );
};

const PlanForm = ({ plan, onSave }: { plan: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState(plan || {
    name: "",
    price: 0,
    features: [""]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{plan ? "Edit Plan" : "Create Plan"}</DialogTitle>
        <DialogDescription>
          {plan ? "Update subscription plan details" : "Add a new subscription plan"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            placeholder="Premium"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Monthly Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Features</Label>
          {formData.features.map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Feature description"
                required
              />
              {formData.features.length > 1 && (
                <Button type="button" size="icon" variant="ghost" onClick={() => removeFeature(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{plan ? "Update" : "Create"} Plan</Button>
      </DialogFooter>
    </form>
  );
};

export default Billing;
