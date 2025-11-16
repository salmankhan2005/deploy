import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Download, Crown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';



export const Billing = () => {
  const navigate = useNavigate();
  const { isSubscribed } = useAuth();
  const [currentPlan] = useState('Premium Monthly');
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadSubscriptionPlans();
    
    // Set up polling to check for plan updates every 30 seconds
    const interval = setInterval(() => {
      loadSubscriptionPlans();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const loadSubscriptionPlans = async () => {
    try {
      // Load subscription plans (no auth required)
      const plansResponse = await fetch('http://127.0.0.1:5000/api/subscription-plans');
      const plansData = await plansResponse.json();
      console.log('Plans response:', plansData);
      setSubscriptionPlans(plansData.plans || []);
      
      // Load billing history (requires auth)
      try {
        const billingResponse = await apiService.request('/billing-history', { method: 'GET' });
        setBillingHistory(billingResponse.billing_history || []);
      } catch (billingError) {
        console.log('Billing history not available (user not authenticated)');
        setBillingHistory([]);
      }
    } catch (error) {
      console.error('Failed to load subscription plans:', error);
      setSubscriptionPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Billing & Subscription" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="container-responsive py-6 space-y-6">
        {/* Current Subscription */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <Badge variant={isSubscribed ? 'default' : 'secondary'}>
              {isSubscribed ? 'Active' : 'Free'}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="font-medium">{isSubscribed ? currentPlan : 'Free Plan'}</p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed ? '$9.99/month' : 'Limited features'}
              </p>
            </div>
          </div>
          {isSubscribed && (
            <p className="text-sm text-muted-foreground mb-4">
              Next billing date: February 15, 2024
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              {isSubscribed ? 'Change Plan' : 'Upgrade to Premium'}
            </Button>
            {isSubscribed && (
              <Button variant="outline" size="sm">Cancel Subscription</Button>
            )}
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Update Payment Method</Button>
        </Card>

        {/* Available Plans */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Plans</h2>
            <Badge variant="secondary" className="text-xs">
              Updates automatically
            </Badge>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading plans...</p>
          ) : subscriptionPlans.length === 0 ? (
            <p className="text-muted-foreground">No subscription plans available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`p-4 ${plan.name === 'Premium' ? 'border-primary' : ''}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="text-2xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" size="sm">
                    {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Card>
        
        {/* Billing History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Billing History</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading billing history...</p>
          ) : billingHistory.length === 0 ? (
            <p className="text-muted-foreground">No billing history available</p>
          ) : (
            <div className="space-y-3">
              {billingHistory.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{bill.plan}</p>
                      <p className="text-sm text-muted-foreground">{bill.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${bill.amount}</p>
                    <Badge variant="secondary" className="text-xs">
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};