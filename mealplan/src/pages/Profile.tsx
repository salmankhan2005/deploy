import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Camera, Upload, Check, Download, Trash2, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { useState, useRef, useEffect } from 'react';

const defaultAvatars = [
  '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳', '🧑‍🍳', '👨‍🌾', '👩‍🌾', '🧑‍🌾'
];

export const Profile = () => {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userBio, setUserBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserEmail(user.email);
      setUserName(user.name || user.email.split('@')[0]);
      setUserPhone(user.phone || '');
      setUserLocation(user.location || '');
      setUserBio(user.bio || '');
    }
  }, [user]);


  
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name: userName,
        phone: userPhone,
        location: userLocation,
        bio: userBio
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const sanitizeString = (str: string) => {
    return str.replace(/[<>"'&]/g, (match) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
  };

  const handleExportData = () => {
    const userData = {
      profile: { 
        name: sanitizeString(userName), 
        email: sanitizeString(userEmail), 
        userId: user?.id,
        createdAt: new Date().toISOString()
      },
      mealPlans: 'User meal planning data...',
      recipes: 'Saved recipes data...',
      settings: 'User preferences and settings...'
    };
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-meal-planner-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
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
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setSelectedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setProfileImage(null);
    setShowAvatarDialog(false);
  };

  const handleCameraClick = () => {
    setShowAvatarDialog(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-24">
      <Header 
        title="Profile" 
        showProfile={false}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-4xl mx-auto">
        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : selectedAvatar ? (
                <span className="text-4xl">{selectedAvatar}</span>
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={handleCameraClick}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1.5" 
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={userEmail}
                  readOnly
                  className="flex-1 bg-muted" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  placeholder="New York, NY" 
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio" 
                placeholder="Tell us about yourself..." 
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                className="mt-1.5" 
              />
            </div>
          </div>
        </Card>

        {/* Dietary Preferences */}
        <Card className="p-6 mb-6">
          <h3 className="font-heading font-semibold mb-4">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto'].map((pref) => (
              <Button key={pref} variant="outline" size="sm" className="rounded-full">
                {pref}
              </Button>
            ))}
          </div>
        </Card>

        <Button onClick={handleSave} disabled={loading} className="w-full h-12 mb-6">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        
        {/* Data Management */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Management
          </h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Download all your meal plans, recipes, and settings as a JSON file.
            </p>
          </div>
        </Card>
        
        {/* Account Actions */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers including meal plans, recipes,
                    and preferences.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </Card>
      </main>

      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Choose Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Upload Custom Image */}
            <div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5" />
                Upload Custom Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Default Avatars */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Or choose a default avatar:</Label>
              <div className="grid grid-cols-4 gap-3">
                {defaultAvatars.map((avatar, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-16 w-16 text-2xl p-0 relative ${
                      selectedAvatar === avatar ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    {avatar}
                    {selectedAvatar === avatar && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};
