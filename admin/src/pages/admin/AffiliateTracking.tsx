import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, DollarSign, Users, TrendingUp, Eye, Edit, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AffiliateTracking = () => {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState([
    { 
      id: 1, 
      name: "John Affiliate", 
      email: "john@affiliate.com", 
      code: "JOHN2024", 
      clicks: 245, 
      conversions: 12, 
      revenue: 1200, 
      commission: 120, 
      status: "Active",
      joinDate: "2024-01-15"
    },
    { 
      id: 2, 
      name: "Sarah Partner", 
      email: "sarah@partner.com", 
      code: "SARAH2024", 
      clicks: 189, 
      conversions: 8, 
      revenue: 800, 
      commission: 80, 
      status: "Active",
      joinDate: "2024-02-20"
    },
    { 
      id: 3, 
      name: "Mike Promoter", 
      email: "mike@promoter.com", 
      code: "MIKE2024", 
      clicks: 67, 
      conversions: 3, 
      revenue: 300, 
      commission: 30, 
      status: "Inactive",
      joinDate: "2024-03-10"
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    commissionRate: "10"
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const affiliateCode = formData.name.toUpperCase().replace(/\s+/g, '') + '2024';
    
    const newAffiliate = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      code: affiliateCode,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      commission: 0,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0]
    };

    setAffiliates([...affiliates, newAffiliate]);
    setFormData({ name: "", email: "", commissionRate: "10" });
    setOpenDialog(false);
    toast({ title: "Success", description: "Affiliate created successfully" });
  };

  const copyAffiliateCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: "Affiliate code copied to clipboard" });
  };

  const totalStats = {
    totalAffiliates: affiliates.length,
    totalClicks: affiliates.reduce((sum, a) => sum + a.clicks, 0),
    totalRevenue: affiliates.reduce((sum, a) => sum + a.revenue, 0),
    totalCommissions: affiliates.reduce((sum, a) => sum + a.commission, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Affiliate Tracking</h1>
          <p className="text-muted-foreground mt-1">Manage affiliate partners and track performance</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Affiliate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Affiliate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAffiliate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Affiliate Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission">Commission Rate (%)</Label>
                <Select value={formData.commissionRate} onValueChange={(value) => setFormData({ ...formData, commissionRate: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                Create Affiliate
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Affiliates</p>
                <p className="text-2xl font-bold">{totalStats.totalAffiliates}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{totalStats.totalClicks}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalStats.totalRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Commissions</p>
                <p className="text-2xl font-bold">${totalStats.totalCommissions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell className="font-medium">{affiliate.name}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">{affiliate.code}</code>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyAffiliateCode(affiliate.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{affiliate.clicks}</TableCell>
                  <TableCell>{affiliate.conversions}</TableCell>
                  <TableCell>${affiliate.revenue}</TableCell>
                  <TableCell>${affiliate.commission}</TableCell>
                  <TableCell>
                    <Badge variant={affiliate.status === "Active" ? "default" : "destructive"}>
                      {affiliate.status}
                    </Badge>
                  </TableCell>
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

export default AffiliateTracking;