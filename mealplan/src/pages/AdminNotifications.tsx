import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Megaphone, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'maintenance':
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'announcement':
      return <Megaphone className="w-5 h-5 text-blue-500" />;
    case 'update':
      return <SettingsIcon className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-primary" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'maintenance':
      return 'bg-orange-100 border-orange-200';
    case 'announcement':
      return 'bg-blue-100 border-blue-200';
    case 'update':
      return 'bg-green-100 border-green-200';
    default:
      return 'bg-gray-100 border-gray-200';
  }
};

export const AdminNotifications = () => {
  const navigate = useNavigate();
  const { supportNotifications, markAsRead } = useNotifications();

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const unreadCount = supportNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Support Notifications" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="container-responsive py-6 space-y-6">
        {/* Header Stats */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-semibold">Support Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {supportNotifications.length > 0 ? (
            supportNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''} ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! Support notifications will appear here.
              </p>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Notification Settings</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Manage Email Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Notification Preferences
            </Button>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};