import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2, Users, Link2, Copy, Mail, MessageCircle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const sharedMealPlans = [
  { id: 1, name: 'Weekly Family Meals', sharedWith: 'Sarah, Mike, Emma', date: '2 days ago' },
  { id: 2, name: 'Keto Diet Plan', sharedWith: 'John, Lisa', date: '1 week ago' },
  { id: 3, name: 'Vegetarian Week', sharedWith: 'Community Group', date: '2 weeks ago' },
];

export const MealSharing = () => {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink] = useState('https://mealplanner.app/share/abc123');

  const handleShare = () => {
    if (!shareEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success(`Meal plan shared with ${shareEmail}`);
    setShareEmail('');
    setShareDialogOpen(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Meal Sharing" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Premium Feature Banner */}
        <Card className="p-6 bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-primary" />
            <h3 className="font-heading font-semibold text-primary">Premium Feature</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Share your meal plans with family, friends, and clients. Collaborate on meal planning together!
          </p>
          <Button className="w-full" onClick={() => navigate('/premium')}>
            Upgrade to Premium
          </Button>
        </Card>

        {/* Share New Plan */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Meal Plan
          </h3>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              onClick={() => setShareDialogOpen(true)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Share via Email
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={copyLink}>
              <Link2 className="w-4 h-4 mr-2" />
              Copy Share Link
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Share via Message
            </Button>
          </div>
        </Card>

        {/* Shared Plans */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Shared Plans
          </h3>
          <div className="space-y-3">
            {sharedMealPlans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{plan.name}</h4>
                <p className="text-sm text-muted-foreground">Shared with: {plan.sharedWith}</p>
                <p className="text-xs text-muted-foreground">{plan.date}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">Edit Access</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Meal Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Share Link</label>
                <div className="flex gap-2 mt-2">
                  <Input value={shareLink} readOnly />
                  <Button variant="outline" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleShare} className="w-full">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};