import Lottie from 'lottie-react';
import inventoryAnimation from '../../Inventory.json';

interface InventoryAnimationProps {
  className?: string;
}

export const InventoryAnimation = ({ className = "w-16 h-16" }: InventoryAnimationProps) => {
  return (
    <div className={className}>
      <Lottie 
        animationData={inventoryAnimation}
        loop
        autoplay
      />
    </div>
  );
};