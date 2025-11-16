import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const freeFeatures = [
  'Basic Meal Planning',
  'Recipe Storage (up to 50)',
  'Shopping Lists',
  'Basic Themes',
];

const premiumFeatures = [
  'Unlimited Recipe Storage',
  'AI Meal Suggestions',
  'Advanced Nutrition Tracking',
  'Professional Features',
  'Priority Customer Support',
  'Ad-Free Experience',
  'Export & Share Meal Plans',
  'Custom Recipe Collections',
  'Advanced Analytics',
  'Multiple Meal Plans',
];

export const Premium = () => {
  const navigate = useNavigate();
  const { subscribe } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  
  const handleSubscribe = () => {
    // Simulate subscription completion
    setTimeout(() => {
      subscribe();
      toast.success('Subscription activated! Premium features unlocked.');
      navigate('/home');
    }, 1500);
    toast.success(`Starting ${selectedPlan} subscription...`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Go Premium" 
        showNotifications={false} 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            Unlock Premium
          </h1>
          <p className="text-muted-foreground">
            Get access to exclusive features and take your meal planning to the next level
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="p-8 mb-6 glass-panel border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
            POPULAR
          </div>
          
          <div className="text-center mb-6">
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="text-5xl font-heading font-bold">$9.99</span>
              <span className="text-muted-foreground mb-2">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              or $99/year (save 17%)
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedPlan('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedPlan('yearly')}
            >
              Yearly
            </Button>
          </div>
          
          <Button className="w-full h-14 text-lg font-semibold gap-2 mb-6" onClick={handleSubscribe}>
            <Sparkles className="w-5 h-5" />
            Start Free Trial
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            7-day free trial • Cancel anytime
          </p>
        </Card>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <h3 className="font-heading font-semibold mb-4 text-center">Free Plan</h3>
            <div className="space-y-3">
              {freeFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 border-primary/30">
            <h3 className="font-heading font-semibold mb-4 text-center text-primary">Premium Plan</h3>
            <div className="space-y-3">
              {premiumFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Trusted by over 10,000+ happy users</p>
        </div>
      </main>
    </div>
  );
};
