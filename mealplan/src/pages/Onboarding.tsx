import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, Calendar, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const slides = [
  {
    icon: ChefHat,
    title: 'Discover Recipes',
    description: 'Explore thousands of delicious recipes tailored to your taste and dietary preferences',
  },
  {
    icon: Calendar,
    title: 'Plan Your Week',
    description: 'Organize your meals weekly with our intuitive meal planning calendar',
  },
  {
    icon: ShoppingBag,
    title: 'Smart Shopping Lists',
    description: 'Generate shopping lists automatically from your meal plans',
  },
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigate('/auth');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    continueAsGuest();
    navigate('/home');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-primary/10 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
            <Icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl font-heading font-bold text-center mb-4">
            {slide.title}
          </h2>
          
          <p className="text-center text-muted-foreground text-lg mb-8">
            {slide.description}
          </p>
          
          <div className="flex justify-center gap-2 mb-12">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-8 space-y-3 max-w-md mx-auto w-full">
        <Button 
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {isLastSlide ? 'Get Started' : 'Next'}
        </Button>
        
        <Button 
          onClick={handleSkip}
          variant="ghost"
          className="w-full h-14 text-lg"
          size="lg"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};
