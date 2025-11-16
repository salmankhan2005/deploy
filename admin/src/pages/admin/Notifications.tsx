import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Notifications = () => {
  const [pushTitle, setPushTitle] = useState('');
  const [pushMessage, setPushMessage] = useState('');
  const [pushTarget, setPushTarget] = useState('All Users');
  const [sending, setSending] = useState(false);

  const sendPushNotification = async () => {
    if (!pushTitle.trim() || !pushMessage.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    setSending(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pushTitle.trim(),
          message: pushMessage.trim(),
          target_audience: pushTarget
        })
      });

      if (response.ok) {
        toast.success(`Notification sent to ${pushTarget}`);
        
        // Clear form
        setPushTitle('');
        setPushMessage('');
        setPushTarget('All Users');
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Send push notifications and emails to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Push Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg md:text-xl">
              <Bell className="h-5 w-5" />
              Push Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="push-title" className="text-sm">Title</Label>
              <Input 
                id="push-title" 
                placeholder="Notification title" 
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="push-message" className="text-sm">Message</Label>
              <Textarea 
                id="push-message" 
                placeholder="Notification message" 
                rows={4}
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="push-target" className="text-sm">Target Audience</Label>
              <select
                id="push-target"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={pushTarget}
                onChange={(e) => setPushTarget(e.target.value)}
              >
                <option>All Users</option>
                <option>Premium Users</option>
                <option>Free Users</option>
                <option>Professionals</option>
              </select>
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={sendPushNotification}
              disabled={sending}
            >
              <Send className="h-4 w-4" />
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg md:text-xl">
              <Mail className="h-5 w-5" />
              Email Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject" className="text-sm">Subject</Label>
              <Input id="email-subject" placeholder="Email subject" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body" className="text-sm">Body</Label>
              <Textarea id="email-body" placeholder="Email body" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-target" className="text-sm">Target Audience</Label>
              <select
                id="email-target"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>All Users</option>
                <option>Premium Users</option>
                <option>Free Users</option>
                <option>Professionals</option>
              </select>
            </div>
            <Button className="w-full gap-2">
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default Notifications;
