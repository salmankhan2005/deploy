import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminApiService } from "@/services/adminApi";
import { useEffect } from "react";

const CreateAdmin = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "sub_admin",
    password: "",
    confirmPassword: ""
  });

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const response = await adminApiService.getAdminUsers();
      setAdmins(response.admins);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load admins", variant: "destructive" });
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (formData.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await adminApiService.createAdminUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      });
      
      setFormData({ name: "", email: "", role: "sub_admin", password: "", confirmPassword: "" });
      await loadAdmins();
      toast({ title: "Success", description: "Admin created successfully" });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create admin", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await adminApiService.deleteAdminUser(id);
      await loadAdmins();
      toast({ title: "Success", description: "Admin deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete admin", variant: "destructive" });
    }
  };

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
    setEditFormData({ name: admin.name, email: admin.email, role: admin.role });
    setEditDialogOpen(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    try {
      await adminApiService.updateAdminUser(editingAdmin.id, editFormData);
      await loadAdmins();
      setEditDialogOpen(false);
      setEditingAdmin(null);
      toast({ title: "Success", description: "Admin updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update admin", variant: "destructive" });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin": return "default";
      case "sub_admin": return "secondary";
      case "market_admin": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Create Admin</h1>
        <p className="text-muted-foreground mt-1">Manage admin accounts and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Admin Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
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
                <Label htmlFor="role">Admin Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="sub_admin">Sub Admin</SelectItem>
                    <SelectItem value="market_admin">Market Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                <Shield className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Admin List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={getRoleBadgeVariant(admin.role)}>
                        {admin.role.replace('_', ' ')}
                      </Badge>
                      <Badge variant={admin.is_active ? "default" : "destructive"}>
                        {admin.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEditAdmin(admin)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteAdmin(admin.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Admin Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Full Name</Label>
              <Input
                id="editName"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editRole">Admin Role</Label>
              <Select value={editFormData.role} onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="sub_admin">Sub Admin</SelectItem>
                  <SelectItem value="market_admin">Market Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Admin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAdmin;