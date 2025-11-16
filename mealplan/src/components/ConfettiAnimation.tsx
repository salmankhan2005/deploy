import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import confettiAnimation from '../../USA confetti.json';

interface ConfettiAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const ConfettiAnimation = ({ trigger, onComplete }: ConfettiAnimationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Lottie 
        animationData={confettiAnimation}
        loop={false}
        autoplay
        className="w-full h-full"
      />
    </div>
  );
};