import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Send, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import emailjs from '@emailjs/browser';

export const Feedback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !feedbackType || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing');
      }

      const templateParams = {
        from_name: name,
        reply_to: email,
        feedback_type: feedbackType,
        rating: rating > 0 ? `${rating}/5 stars` : 'No rating',
        message: message
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast.success('Thank you for your feedback! We appreciate your input.');
      if (!user) {
        setName('');
        setEmail('');
      }
      setFeedbackType('');
      setRating(0);
      setMessage('');
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Feedback" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-heading font-semibold text-lg">Share Your Feedback</h2>
              <p className="text-sm text-muted-foreground">Help us improve your experience</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="feedback-type">Feedback Type *</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rate Your Experience</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="message">Your Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};