import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  className?: string;
  heading?: boolean;
}

const sizeClasses = {
  xs: 'text-xs sm:text-sm md:text-base',
  sm: 'text-sm sm:text-base md:text-lg',
  base: 'text-base sm:text-lg md:text-xl',
  lg: 'text-lg sm:text-xl md:text-2xl',
  xl: 'text-xl sm:text-2xl md:text-3xl',
  '2xl': 'text-2xl sm:text-3xl md:text-4xl',
  '3xl': 'text-3xl sm:text-4xl md:text-5xl'
};

const headingSizeClasses = {
  xs: 'text-sm sm:text-base md:text-lg',
  sm: 'text-base sm:text-lg md:text-xl',
  base: 'text-lg sm:text-xl md:text-2xl',
  lg: 'text-xl sm:text-2xl md:text-3xl',
  xl: 'text-2xl sm:text-3xl md:text-4xl',
  '2xl': 'text-3xl sm:text-4xl md:text-5xl',
  '3xl': 'text-4xl sm:text-5xl md:text-6xl'
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

export const ResponsiveText = ({ 
  children, 
  as: Component = 'p', 
  size = 'base', 
  weight = 'normal',
  heading = false,
  className 
}: ResponsiveTextProps) => {
  const sizeClass = heading ? headingSizeClasses[size] : sizeClasses[size];
  const fontFamily = heading ? 'font-heading' : '';
  
  return (
    <Component className={cn(
      sizeClass,
      weightClasses[weight],
      fontFamily,
      className
    )}>
      {children}
    </Component>
  );
};