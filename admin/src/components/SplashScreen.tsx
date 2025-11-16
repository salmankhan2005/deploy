import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-card via-primary/5 to-accent transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative text-center space-y-8">
        {/* Animated icon container */}
        <div className="relative mx-auto w-32 h-32 animate-bounce-in">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin-slow" />
          
          {/* Middle ring */}
          <div className="absolute inset-2 border-4 border-secondary/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }} />
          
          {/* Inner circle with icon */}
          <div className="absolute inset-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl animate-float">
            <Leaf className="w-12 h-12 text-primary-foreground drop-shadow-lg" />
          </div>
        </div>

        {/* Title with staggered animation */}
        <div className="space-y-3">
          <h1 className="text-6xl md:text-7xl font-heading font-bold bg-gradient-to-r from-primary via-sidebar-primary to-secondary bg-clip-text text-transparent animate-fade-in drop-shadow-sm">
            Morning Dew
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent animate-scale-in" style={{ animationDelay: '0.3s' }} />
          <p className="text-2xl text-muted-foreground font-sans animate-slide-up" style={{ animationDelay: '0.5s' }}>
            Meal Planner
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
