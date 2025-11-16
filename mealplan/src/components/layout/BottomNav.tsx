import { Home, BookOpen, ShoppingCart, MoreHorizontal, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDeviceType } from '@/hooks/use-mobile';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/recipes', icon: BookOpen, label: 'Recipes' },
  { path: '/discover', icon: Compass, label: 'Discover' },
  { path: '/shopping', icon: ShoppingCart, label: 'Shopping' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

export const BottomNav = () => {
  const location = useLocation();
  const { isMobile, isTablet } = useDeviceType();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-bottom shadow-lg">
      <div className="container-responsive flex justify-around items-center h-14 xs:h-16 sm:h-18 lg:h-20">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              data-tour={label.toLowerCase()}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 py-1.5 xs:py-2 sm:py-3 gap-0.5 xs:gap-1 sm:gap-1.5 rounded-lg hover:scale-105 touch-manipulation min-w-0",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:text-primary"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0 transition-all duration-200", 
                isActive && "fill-primary/20 scale-110"
              )} />
              <span className={cn(
                "text-[9px] xs:text-[10px] sm:text-xs lg:text-sm font-medium leading-tight text-center truncate max-w-full",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
