import Lottie from 'lottie-react';
import cookingAnimation from '../../Cooking.json';

interface LottieAnimationProps {
  className?: string;
}

export const LottieAnimation = ({ className = "w-16 h-16" }: LottieAnimationProps) => {
  return (
    <div className={className}>
      <Lottie 
        animationData={cookingAnimation}
        loop
        autoplay
      />
    </div>
  );
};