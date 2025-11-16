import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat } from 'lucide-react';
import { toast } from 'sonner';
import { ConfettiAnimation } from '@/components/ConfettiAnimation';
import { LoadingButton } from '@/components/LoadingButton';
import { testConnection } from '@/services/test-api';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, continueAsGuest } = useAuth();

  useEffect(() => {
    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password) {
      setLoading(true);
      try {
        if (isLogin) {
          await login(email, password);
          setShowConfetti(true);
          toast.success('Welcome back!');
          setTimeout(() => navigate('/home'), 2000);
        } else {
          await register(email, password);
          toast.success('Account created successfully!');
          // Clear form fields after successful registration
          setEmail('');
          setPassword('');
          // Switch to login mode after registration
          setIsLogin(true);
          // No need to navigate, just switch the form to login mode
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        
        // Special handling for connection errors
        if (errorMessage.includes('Cannot connect to server')) {
          toast.error('Cannot connect to server', {
            description: 'Would you like to continue in guest mode?',
            action: {
              label: 'Continue as Guest',
              onClick: () => {
                continueAsGuest();
                navigate('/home');
              }
            }
          });
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleGuestMode = async () => {
    setGuestLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    continueAsGuest();
    navigate('/home');
    setGuestLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-full p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <ChefHat className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {isLogin ? 'Sign in to continue' : 'Join FreshPlate today'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            
            <LoadingButton 
              type="submit" 
              className="w-full h-12 text-base font-semibold mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300" 
              loading={loading}
              loadingText={isLogin ? 'Signing in...' : 'Creating account...'}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </LoadingButton>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or</span>
            </div>
          </div>
          
          <LoadingButton
            onClick={handleGuestMode}
            variant="outline"
            className="w-full h-12 text-base hover:bg-muted/50 hover:shadow-md transition-all duration-300"
            loading={guestLoading}
            loadingText="Entering guest mode..."
          >
            Continue as Guest
          </LoadingButton>
        </div>
      </div>
      
      <ConfettiAnimation 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
};
