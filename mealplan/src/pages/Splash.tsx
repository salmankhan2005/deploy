import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Sparkles } from 'lucide-react';

export const Splash = () => {
  const navigate = useNavigate();
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Stage 1: Icon appears
    const stage1 = setTimeout(() => setAnimationStage(1), 300);
    // Stage 2: Title appears
    const stage2 = setTimeout(() => setAnimationStage(2), 1200);
    // Stage 3: Subtitle appears
    const stage3 = setTimeout(() => setAnimationStage(3), 2000);
    // Stage 4: Sparkles appear
    const stage4 = setTimeout(() => setAnimationStage(4), 2800);
    
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 4000);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      clearTimeout(stage4);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary-hover to-primary overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white/20 rounded-full animate-pulse ${
              animationStage >= 4 ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-500`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon container with enhanced animation */}
        <div className={`relative mb-8 transition-all duration-700 ease-out ${
          animationStage >= 1 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-75 translate-y-8'
        }`}>
          <div className="relative bg-white/25 backdrop-blur-xl rounded-full p-10 shadow-2xl border border-white/30">
            <ChefHat className="w-28 h-28 text-white drop-shadow-lg" strokeWidth={1.5} />
            
            {/* Rotating ring around icon */}
            <div className={`absolute inset-0 rounded-full border-2 border-white/40 ${
              animationStage >= 1 ? 'animate-spin' : ''
            }`} style={{ animationDuration: '8s' }} />
            
            {/* Pulsing glow effect */}
            <div className={`absolute inset-0 rounded-full bg-white/10 ${
              animationStage >= 1 ? 'animate-ping' : ''
            }`} style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Sparkle effects around icon */}
          {animationStage >= 4 && (
            <>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-yellow-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="absolute top-1/2 -left-4 w-5 h-5 text-yellow-100 animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>

        {/* Title with staggered letter animation */}
        <h1 className={`text-5xl font-heading font-bold text-white text-center mb-3 transition-all duration-700 ease-out ${
          animationStage >= 2 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0s', animationDuration: '1s' }}>M</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '1s' }}>e</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }}>a</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1s' }}>l</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }}>&nbsp;</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '1s' }}>P</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1s' }}>l</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '1s' }}>a</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '1s' }}>n</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '1s' }}>&nbsp;</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '1.0s', animationDuration: '1s' }}>P</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '1.1s', animationDuration: '1s' }}>r</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '1s' }}>o</span>
        </h1>
        
        {/* Subtitle with fade-in effect */}
        <p className={`text-xl text-white/90 text-center font-medium transition-all duration-700 ease-out ${
          animationStage >= 3 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          Your kitchen companion
        </p>
        
        {/* Loading indicator */}
        <div className={`mt-8 transition-all duration-500 ${
          animationStage >= 3 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};