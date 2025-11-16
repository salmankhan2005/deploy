import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';
import { GenieAnimation } from '@/components/GenieAnimation';
import { TypewriterText } from '@/components/TypewriterText';
import { useDeviceType } from '@/hooks/use-mobile';
import { ResponsiveText } from '@/components/ui/responsive-text';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  geniePosition?: { 
    mobile: { x: number; y: number };
    tablet: { x: number; y: number };
    desktop: { x: number; y: number };
  };
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mealplan pro! 🧞‍♂️',
    description: 'Hi there! I\'m your kitchen genie. Let me show you around this magical meal planning world!',
    position: 'center'
  },
  {
    id: 'home-nav',
    title: 'Home - Your Command Center',
    description: 'This is your meal planning dashboard where all the magic happens!',
    target: '[data-tour="home"]',
    position: 'top',
    geniePosition: {
      mobile: { x: 20, y: 75 },
      tablet: { x: 20, y: 80 },
      desktop: { x: 20, y: 85 }
    }
  },
  {
    id: 'recipes-nav',
    title: 'Recipes - Your Cookbook',
    description: 'Browse and save delicious recipes here. Build your personal collection!',
    target: '[data-tour="recipes"]',
    position: 'top',
    geniePosition: {
      mobile: { x: 35, y: 75 },
      tablet: { x: 35, y: 80 },
      desktop: { x: 35, y: 85 }
    }
  },
  {
    id: 'discover-nav',
    title: 'Discover - Find New Flavors',
    description: 'Explore trending recipes and discover new cuisines!',
    target: '[data-tour="discover"]',
    position: 'top',
    geniePosition: {
      mobile: { x: 50, y: 75 },
      tablet: { x: 50, y: 80 },
      desktop: { x: 50, y: 85 }
    }
  },
  {
    id: 'shopping-nav',
    title: 'Shopping - Smart Lists',
    description: 'Your intelligent shopping companion. Never forget ingredients again!',
    target: '[data-tour="shopping"]',
    position: 'top',
    geniePosition: {
      mobile: { x: 65, y: 75 },
      tablet: { x: 65, y: 80 },
      desktop: { x: 65, y: 85 }
    }
  },
  {
    id: 'more-nav',
    title: 'More - Extra Features',
    description: 'Access settings, profile, and additional features here.',
    target: '[data-tour="more"]',
    position: 'top',
    geniePosition: {
      mobile: { x: 80, y: 75 },
      tablet: { x: 80, y: 80 },
      desktop: { x: 80, y: 85 }
    }
  },
  {
    id: 'complete',
    title: 'You\'re All Set! ✨',
    description: 'That\'s the tour! Tap anywhere to start your culinary journey. Happy cooking!',
    position: 'center'
  }
];

interface GuidedTourProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const GuidedTour = ({ isVisible, onComplete }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isMobile, isTablet, deviceType } = useDeviceType();

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && tourSteps[currentStep]) {
      speakText(tourSteps[currentStep].description);
    }
  }, [currentStep, isVisible]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const nextStep = () => {
    stopSpeaking();
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
      setIsAnimating(false);
    }, 300);
  };

  const skipTour = () => {
    stopSpeaking();
    onComplete();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];

  const getTargetElement = () => {
    if (!step.target) return null;
    return document.querySelector(step.target);
  };

  const getSpotlightStyle = () => {
    const element = getTargetElement();
    if (!element) return {};
    
    const rect = element.getBoundingClientRect();
    const padding = isMobile ? 12 : isTablet ? 10 : 8;
    
    return {
      left: rect.left - padding,
      top: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    };
  };

  const getGenieStyle = () => {
    if (!step.geniePosition) return {};
    
    const position = step.geniePosition[deviceType as keyof typeof step.geniePosition];
    
    return {
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  const getGenieSize = () => {
    if (isMobile) return 'w-20 h-20';
    if (isTablet) return 'w-24 h-24';
    return 'w-28 h-28';
  };

  const getSpeechBubbleClasses = () => {
    if (isMobile) {
      return 'absolute bottom-full mb-1 left-0 bg-white rounded-md shadow-lg border border-gray-200 px-3 py-2 text-left max-w-[80vw] w-fit inline-block';
    }
    if (isTablet) {
      return 'absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2.5 max-w-[70vw] w-fit inline-block text-left';
    }
    return 'absolute bottom-full mb-3 left-0 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 max-w-[320px] w-fit inline-block';
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay */}
      <div className="absolute inset-0 tour-overlay" />
      
      {/* Spotlight effect */}
      {step.target && (
        <>
          <div 
            className="absolute bg-transparent border-4 border-primary rounded-lg shadow-lg shadow-primary/50 animate-pulse"
            style={getSpotlightStyle()}
          />
          <div 
            className="absolute bg-transparent rounded-lg tour-spotlight"
            style={getSpotlightStyle()}
          />
        </>
      )}

      {/* Animated Genie */}
      {step.geniePosition && (
        <div 
          className="absolute z-20 transition-all duration-1000 ease-in-out"
          style={getGenieStyle()}
        >
          <div className={`${getGenieSize()} ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`}>
            <GenieAnimation
              className="w-full h-full"
            />
          </div>
          {/* Speech bubble */}
          <div className={getSpeechBubbleClasses()}>
            <div className={`${isMobile ? 'space-y-0' : 'flex flex-col space-y-0.5'}`}>
              <div className={`${isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-sm'} text-gray-800 font-semibold text-center ${isMobile ? 'mb-0.5' : ''}`}>
                <TypewriterText text={step.title} speed={80} />
              </div>
              <div className={`${isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs'} text-gray-600 text-center leading-tight break-words`}>
                <TypewriterText text={step.description} speed={30} />
              </div>
            </div>
            {/* Speech bubble tail pointing down */}
            {isMobile ? (
              <div className="absolute top-full left-4">
                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-white"></div>
              </div>
            ) : isTablet ? (
              <div className="absolute top-full left-6">
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white"></div>
              </div>
            ) : (
              <div className="absolute top-full left-8">
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tour card */}
      <div className={`absolute transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${
        step.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
        step.position === 'bottom' ? `${isMobile ? 'bottom-20' : isTablet ? 'bottom-24' : 'bottom-32'} ${isMobile ? 'left-3 right-3' : 'left-4 right-4'}` :
        step.position === 'top' ? `${isMobile ? 'top-20' : isTablet ? 'top-24' : 'top-28'} ${isMobile ? 'left-3 right-3' : 'left-4 right-4'}` :
        `${isMobile ? 'left-3 right-3' : 'left-4 right-4'} top-1/2 transform -translate-y-1/2`
      } z-10`}>
        <Card className={`${isMobile ? 'p-4 max-w-sm' : isTablet ? 'p-5 max-w-md' : 'p-6 max-w-lg'} mx-auto bg-card border-2 border-primary/20 shadow-2xl backdrop-blur-sm`}>
          {/* Close button */}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            className={`absolute ${isMobile ? 'top-1 right-1 h-7 w-7' : 'top-2 right-2 h-8 w-8'} p-0 touch-manipulation`}
            onClick={skipTour}
          >
            <X className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          </Button>

          {/* Genie animation for center position */}
          {step.position === 'center' && (
            <div className={`flex justify-center ${isMobile ? 'mb-2' : 'mb-3'}`}>
              <div className={`${isMobile ? 'w-28 h-28' : isTablet ? 'w-32 h-32' : 'w-36 h-36'} ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`}>
                <GenieAnimation
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="text-center">
            <ResponsiveText 
              as="h3" 
              size={isMobile ? 'xs' : isTablet ? 'sm' : 'base'} 
              weight="semibold" 
              className={`text-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}
              heading
            >
              {step.title}
            </ResponsiveText>
            <ResponsiveText 
              as="p" 
              size="xs" 
              className={`text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'} leading-relaxed px-1`}
            >
              {step.description}
            </ResponsiveText>



            {/* Progress dots */}
            <div className={`flex justify-center gap-1 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className={`flex ${isMobile ? 'gap-2 flex-col' : 'gap-3 flex-row'}`}>
              <Button
                variant="outline"
                onClick={skipTour}
                className={`${isMobile ? 'w-full' : 'flex-1'} btn-responsive`}
                size={isMobile ? 'default' : 'sm'}
              >
                <ResponsiveText size="xs" className="font-medium">
                  Skip Tour
                </ResponsiveText>
              </Button>
              <Button
                onClick={nextStep}
                className={`${isMobile ? 'w-full' : 'flex-1'} gap-2 bg-primary hover:bg-primary/90 btn-responsive`}
                size={isMobile ? 'default' : 'sm'}
              >
                <ResponsiveText size="xs" className="font-medium">
                  {currentStep === tourSteps.length - 1 ? 'Start Cooking!' : 'Got it!'}
                </ResponsiveText>
                {currentStep < tourSteps.length - 1 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Touch overlay for mobile - allows tapping anywhere to continue */}
      {isMobile && (
        <div 
          className="absolute inset-0 z-5" 
          onClick={nextStep}
          style={{ pointerEvents: step.position === 'center' ? 'auto' : 'none' }}
        />
      )}
    </div>
  );
};