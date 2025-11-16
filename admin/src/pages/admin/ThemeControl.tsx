import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Palette, Plus, Edit, Trash2, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ThemeControl = () => {
  const { toast } = useToast();
  const [themes, setThemes] = useState([
    { id: 1, name: "Light Mode", status: "Active", users: 850, preview: "#ffffff", accent: "#3b82f6" },
    { id: 2, name: "Dark Mode", status: "Active", users: 650, preview: "#1f2937", accent: "#10b981" },
    { id: 3, name: "Morning Dew", status: "Active", users: 320, preview: "#f0fdf4", accent: "#22c55e" },
    { id: 4, name: "Cozy Rustic", status: "Inactive", users: 45, preview: "#fef7ed", accent: "#ea580c" },
    { id: 5, name: "Vibrant Healthy", status: "Active", users: 180, preview: "#ecfdf5", accent: "#059669" },
    { id: 6, name: "Genie", status: "Active", users: 0, preview: "#111827", accent: "#FACC15" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    backgroundColor: "#ffffff"
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTheme = {
      id: Date.now(),
      name: formData.name,
      status: "Active",
      users: 0,
      preview: formData.backgroundColor,
      accent: formData.primaryColor
    };

    setThemes([...themes, newTheme]);
    setFormData({ name: "", primaryColor: "#3b82f6", secondaryColor: "#10b981", backgroundColor: "#ffffff" });
    setOpenDialog(false);
    toast({ title: "Success", description: "Theme created successfully" });
  };

  const toggleThemeStatus = (id: number) => {
    setThemes(themes.map(theme => 
      theme.id === id 
        ? { ...theme, status: theme.status === "Active" ? "Inactive" : "Active" }
        : theme
    ));
    toast({ title: "Success", description: "Theme status updated" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Theme Control</h1>
          <p className="text-muted-foreground mt-1">Manage app themes and customization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Theme
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Theme
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Theme</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTheme} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Theme Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Create Theme
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                <Badge variant={theme.status === "Active" ? "default" : "secondary"}>
                  {theme.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Preview */}
              <div className="h-24 rounded-lg border-2 relative overflow-hidden" style={{ backgroundColor: theme.preview }}>
                <div className="absolute top-2 left-2 w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                <div className="absolute bottom-2 right-2 w-8 h-2 rounded" style={{ backgroundColor: theme.accent, opacity: 0.7 }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-8 rounded border" style={{ backgroundColor: theme.preview === "#ffffff" ? "#f3f4f6" : "#374151" }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Users:</span>
                <span className="font-medium">{theme.users}</span>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleThemeStatus(theme.id)}>
                  {theme.status === "Active" ? "Disable" : "Enable"}
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Theme Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">{themes.length}</p>
              <p className="text-sm text-muted-foreground">Total Themes</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">{themes.filter(t => t.status === "Active").length}</p>
              <p className="text-sm text-muted-foreground">Active Themes</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">{themes.reduce((sum, t) => sum + t.users, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">{Math.max(...themes.map(t => t.users))}</p>
              <p className="text-sm text-muted-foreground">Most Popular</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeControl;