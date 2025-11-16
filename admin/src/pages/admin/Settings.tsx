import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save, Shield } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage admin roles and app settings</p>
      </div>

      {/* Admin Roles */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg md:text-xl">
            <Shield className="h-5 w-5" />
            Admin Roles & Permissions
          </CardTitle>
          <CardDescription className="text-sm">Manage who can access admin features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 md:space-y-6">
            {[
              { name: "John Admin", email: "john@admin.com", role: "Super Admin" },
              { name: "Jane Manager", email: "jane@admin.com", role: "Manager" },
              { name: "Mike Support", email: "mike@admin.com", role: "Support" },
            ].map((admin, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 rounded-lg border">
                <div>
                  <p className="font-medium text-sm md:text-base">{admin.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{admin.email}</p>
                </div>
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>{admin.role}</option>
                  <option>Super Admin</option>
                  <option>Manager</option>
                  <option>Support</option>
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading text-lg md:text-xl">App Settings</CardTitle>
          <CardDescription className="text-sm">Configure global app settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="app-name" className="text-sm">App Name</Label>
            <Input id="app-name" defaultValue="Meal Planner" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email" className="text-sm">Support Email</Label>
            <Input id="support-email" type="email" defaultValue="support@mealplanner.com" />
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="maintenance" className="cursor-pointer text-sm md:text-base">Maintenance Mode</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Enable maintenance mode for updates</p>
              </div>
              <Switch id="maintenance" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="registration" className="cursor-pointer text-sm md:text-base">User Registration</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Allow new users to sign up</p>
              </div>
              <Switch id="registration" defaultChecked />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="analytics" className="cursor-pointer text-sm md:text-base">Analytics</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Track user behavior and app usage</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
          </div>

          <Button className="gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
