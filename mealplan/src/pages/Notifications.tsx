import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, ShoppingCart, Star, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const Notifications = () => {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState([]);

  // Load notifications from backend
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (response.ok) {
          const notifications = await response.json();
          console.log('Fetched notifications from backend:', notifications);
          
          const formattedNotifications = notifications.map(notif => {
            console.log(`Notification ${notif.id}: is_read=${notif.is_read}, unread=${!notif.is_read}`);
            return {
              id: notif.id,
              icon: Bell,
              title: notif.title,
              message: notif.message,
              time: getTimeAgo(notif.created_at),
              unread: !notif.is_read,
              type: 'admin'
            };
          });
          
          setNotificationList(formattedNotifications);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotificationList([]);
      }
    };

    loadNotifications();

    // Check for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };
  
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setNotificationList(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, unread: false } : notif
          )
        );
        toast.success('Marked as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/delete`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNotificationList(prev => prev.filter(notif => notif.id !== id));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };
  
  const clearAll = () => {
    localStorage.removeItem('app_notifications');
    setNotificationList([]);
    toast.success('All notifications cleared');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Notifications" 
        showNotifications={false} 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {notificationList.filter(n => n.unread).length} unread notifications
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => {
              const loadNotifications = () => {
                const rawData = localStorage.getItem('app_notifications');
                console.log('Manual refresh - Raw data:', rawData);
                const adminNotifications = JSON.parse(rawData || '[]');
                const formattedNotifications = adminNotifications.map(notif => ({
                  id: notif.id,
                  icon: Bell,
                  title: notif.title,
                  message: notif.message,
                  time: getTimeAgo(notif.timestamp),
                  unread: !notif.read,
                  type: 'admin'
                }));
                setNotificationList(formattedNotifications);
              };
              loadNotifications();
            }}>
              Refresh
            </Button>
            {notificationList.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        {notificationList.length > 0 ? (
          <div className="space-y-3">
            {notificationList.map((notification, idx) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors animate-fade-up ${
                    notification.unread ? 'border-primary/30 bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.unread ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        notification.unread ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <div className="flex items-center gap-1">
                          {notification.unread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-green-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                          {notification.unread && (
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold mb-2">No Notifications</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};
