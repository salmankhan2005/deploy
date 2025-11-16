import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, Plus, Edit, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CouponManagement = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SAVE20", discount: 20, type: "percentage", uses: 45, maxUses: 100, status: "Active", expiryDate: "2024-12-31" },
    { id: 2, code: "NEWUSER", discount: 10, type: "fixed", uses: 23, maxUses: 50, status: "Active", expiryDate: "2024-11-30" },
    { id: 3, code: "EXPIRED10", discount: 10, type: "percentage", uses: 100, maxUses: 100, status: "Expired", expiryDate: "2024-01-15" },
  ]);

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percentage",
    maxUses: "",
    expiryDate: ""
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCoupon = {
      id: Date.now(),
      code: formData.code,
      discount: parseInt(formData.discount),
      type: formData.type,
      uses: 0,
      maxUses: parseInt(formData.maxUses),
      status: "Active",
      expiryDate: formData.expiryDate
    };

    setCoupons([...coupons, newCoupon]);
    setFormData({ code: "", discount: "", type: "percentage", maxUses: "", expiryDate: "" });
    setOpenDialog(false);
    toast({ title: "Success", description: "Coupon created successfully" });
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: "Coupon code copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Coupon Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage discount coupons</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SAVE20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Value</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
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
                <Label htmlFor="maxUses">Max Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Create Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Active Coupons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">{coupon.code}</code>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyCouponCode(coupon.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.discount}{coupon.type === "percentage" ? "%" : "$"}
                  </TableCell>
                  <TableCell>{coupon.uses}/{coupon.maxUses}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.status === "Active" ? "default" : "destructive"}>
                      {coupon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{coupon.expiryDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponManagement;