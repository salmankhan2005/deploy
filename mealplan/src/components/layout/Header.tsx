import { Bell, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDeviceType } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  showProfile?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const Header = ({ title, showNotifications = true, showProfile = true, showBackButton = false, onBackClick }: HeaderProps) => {
  const { isMobile, isTablet } = useDeviceType();
  const { isGuest } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showGuestNotification, setShowGuestNotification] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault();
      setShowGuestNotification(true);
      setTimeout(() => setShowGuestNotification(false), 3000);
    }
  };

  useEffect(() => {
    const updateNotificationCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (response.ok) {
          const notifications = await response.json();
          setNotificationCount(notifications.length);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    updateNotificationCount();

    // Check for notification updates every 10 seconds
    const interval = setInterval(updateNotificationCount, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <header className="mobile-header">
      <div className="container-responsive flex items-center justify-between h-14 sm:h-16 px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBackClick}
              className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 shrink-0 touch-manipulation hover:scale-110 transition-transform duration-200"
            >
              <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            </Button>
          )}
          <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 shrink-0">
          {showNotifications && (
            <Link to="/notifications">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 touch-manipulation hover:scale-110 transition-transform duration-200"
              >
                <Bell className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Button>
            </Link>
          )}
          
          {showProfile && (
            <Link to={isGuest ? "#" : "/profile"} onClick={handleProfileClick}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 touch-manipulation hover:scale-110 transition-transform duration-200"
              >
                <User className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Guest Mode Notification Popup */}
      {showGuestNotification && (
        <div className="fixed top-16 left-4 right-4 z-50 animate-fade-up">
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-lg mx-auto max-w-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium truncate">You are in guest mode. Login for more features!</span>
              </div>
              <Button
                size="sm"
                className="h-6 px-2 text-xs sm:h-7 sm:px-3 shrink-0"
                onClick={() => {
                  setShowGuestNotification(false);
                  window.location.href = '/auth';
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
