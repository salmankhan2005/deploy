import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowCard = ({ children, className = '', glowColor = 'primary' }: GlowCardProps) => {
  const glowClass = glowColor === 'primary' 
    ? 'hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30' 
    : `hover:shadow-lg hover:shadow-${glowColor}/20 hover:border-${glowColor}/30`;

  return (
    <Card className={`transition-all duration-300 hover:scale-[1.02] ${glowClass} ${className}`}>
      {children}
    </Card>
  );
};