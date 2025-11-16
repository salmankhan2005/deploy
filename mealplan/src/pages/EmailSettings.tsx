import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Bell, Settings, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { useState } from 'react';
import { toast } from 'sonner';

export const EmailSettings = () => {
  const navigate = useNavigate();
  const { emailSettings, updateEmailSettings } = useNotifications();
  const [email, setEmail] = useState('user@example.com');

  const handleSettingChange = (setting: keyof typeof emailSettings, value: boolean) => {
    updateEmailSettings({ [setting]: value });
    toast.success('Email preferences updated');
  };

  const handleUnsubscribeAll = () => {
    updateEmailSettings({
      newsletter: false,
      supportNotifications: false,
      recipeUpdates: false,
      mealReminders: false
    });
    toast.success('Unsubscribed from all emails');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Email Settings" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="container-responsive py-6 space-y-6">
        {/* Email Address */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Email Address</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Primary Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button size="sm">Update Email</Button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Email Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">Weekly meal planning tips and recipes</p>
              </div>
              <Switch
                checked={emailSettings.newsletter}
                onCheckedChange={(checked) => handleSettingChange('newsletter', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Support Notifications</p>
                <p className="text-sm text-muted-foreground">Important updates and announcements</p>
              </div>
              <Switch
                checked={emailSettings.supportNotifications}
                onCheckedChange={(checked) => handleSettingChange('supportNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recipe Updates</p>
                <p className="text-sm text-muted-foreground">New recipes and cooking tips</p>
              </div>
              <Switch
                checked={emailSettings.recipeUpdates}
                onCheckedChange={(checked) => handleSettingChange('recipeUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Meal Reminders</p>
                <p className="text-sm text-muted-foreground">Daily meal planning reminders</p>
              </div>
              <Switch
                checked={emailSettings.mealReminders}
                onCheckedChange={(checked) => handleSettingChange('mealReminders', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Email Templates */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Email Templates</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Welcome Email</p>
              <p className="text-sm text-muted-foreground">Sent when you join the platform</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Weekly Newsletter</p>
              <p className="text-sm text-muted-foreground">Recipe recommendations and tips</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Meal Reminders</p>
              <p className="text-sm text-muted-foreground">Daily meal planning notifications</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={handleUnsubscribeAll}>
            Unsubscribe from All Emails
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Email History
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};