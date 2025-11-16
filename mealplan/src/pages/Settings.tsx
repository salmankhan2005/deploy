import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Bell, Lock, Globe, User, Download, Trash2, LogOut, Shield, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

export const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout, isAuthenticated, user, updateProfile } = useAuth();
  
  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [dataSync, setDataSync] = useState(true);
  const [language, setLanguage] = useState('en');

  
  // Dialog states
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || user.email.split('@')[0]);
      setProfileEmail(user.email);
    }
  }, [user]);
  
  // Get base theme name (without -dark suffix)
  const getBaseTheme = (themeName: string | undefined): string => {
    if (!themeName || themeName === 'dark') return 'light';
    if (themeName === 'genie') return 'genie';
    return themeName.replace('-dark', '');
  };
  
  // Determine if current theme is in dark mode
  const isDarkMode = theme?.endsWith('-dark') || theme === 'dark' || theme === 'genie';
  const baseTheme = getBaseTheme(theme);
  
  const handleDarkModeToggle = useCallback((checked: boolean) => {
    const currentBase = getBaseTheme(theme);
    if (checked) {
      if (currentBase === 'light') {
        setTheme('dark');
      } else if (currentBase === 'genie') {
        setTheme('genie');
      } else {
        setTheme(`${currentBase}-dark`);
      }
    } else {
      setTheme('light');
    }
  }, [theme, setTheme]);

  const handleThemeChange = useCallback((newTheme: string) => {
    // Always set the theme directly
    setTheme(newTheme);
  }, [setTheme]);

  const handleBackClick = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/more');
    }
  }, [navigate]);
  
  // Settings handlers
  const handleProfileUpdate = async () => {
    if (!profileName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setLoading(true);
    try {
      await updateProfile({ name: profileName.trim() });
      toast.success('Profile updated successfully');
      setProfileDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      await apiService.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
    setExportDialogOpen(false);
  };
  
  const handleDeleteAccount = async () => {
    try {
      if (isAuthenticated) {
        await apiService.deleteAccount();
      }
      logout();
      localStorage.clear();
      navigate('/auth');
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
    setDeleteDialogOpen(false);
  };
  
  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Settings" 
        showNotifications={false} 
        showProfile={false} 
        showBackButton={true}
        onBackClick={handleBackClick}
      />
      
      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => setProfileDialogOpen(true)}>
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setPasswordDialogOpen(true)}>
              Change Password
            </Button>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch 
                id="dark-mode" 
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8 px-2"
                  aria-label="Refresh page"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <select
                id="theme-select"
                value={baseTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-card text-card-foreground"
              >
                <option value="light">Default Theme</option>
                <option value="morning-dew">Morning Dew</option>
                <option value="clean-minimalist">Clean & Minimalist</option>
                <option value="cozy-rustic">Cozy & Rustic</option>
                <option value="vibrant-healthy">Vibrant & Healthy</option>
                <option value="gourmet-elegant">Gourmet & Elegant</option>
                <option value="playful-fun">Playful & Fun</option>
                <option value="comic">Comic</option>
                <option value="genie">Genie</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notif">Push Notifications</Label>
              <Switch id="push-notif" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch id="email-notif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="meal-reminders">Meal Reminders</Label>
              <Switch id="meal-reminders" checked={mealReminders} onCheckedChange={setMealReminders} />
            </div>
          </div>
        </Card>



        {/* Data & Storage Section */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data & Storage
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Auto Backup</Label>
              <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sync">Cloud Sync</Label>
              <Switch id="data-sync" checked={dataSync} onCheckedChange={setDataSync} />
            </div>
            <Button variant="outline" className="w-full justify-start" onClick={() => setExportDialogOpen(true)}>
              Export My Data
            </Button>
          </div>
        </Card>

        {/* Privacy & Security Section */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Terms of Service
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Data Usage Policy
            </Button>
          </div>
        </Card>

        {/* Account Actions Section */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Account Actions
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Profile Dialog */}
        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleProfileUpdate} disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Password Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handlePasswordChange} disabled={loading} className="w-full">
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Export all your meal plans, recipes, and preferences. You'll receive an email with the download link.
              </p>
              <Button onClick={handleExportData} className="w-full">
                Start Export
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1">
                  Delete Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <BottomNav />
    </div>
  );
};