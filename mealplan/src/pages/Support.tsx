import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Send, HelpCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const faqs = [
  {
    question: "How do I upgrade to Premium?",
    answer: "Go to Settings > Premium to upgrade your account and unlock all features."
  },
  {
    question: "Can I share my meal plans?",
    answer: "Yes! Premium users can share meal plans with family members and friends."
  },
  {
    question: "How do I add custom recipes?",
    answer: "Use the Recipe Builder in the Recipes section to create your own custom recipes."
  },
  {
    question: "Is my data synced across devices?",
    answer: "Yes, all your data is automatically synced when you're signed in to your account."
  }
];

export const Support = () => {
  const navigate = useNavigate();
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    description: '',
    email: ''
  });

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Support ticket submitted successfully!');
    setTicketForm({ subject: '', category: '', description: '', email: '' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Help & Support" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="container-responsive py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium">Live Chat</p>
            <p className="text-xs text-muted-foreground">Get instant help</p>
            <Button size="sm" className="mt-2 w-full">Start Chat</Button>
          </Card>
          <Card className="p-4 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium">Email Support</p>
            <p className="text-xs text-muted-foreground">support@mealplanner.com</p>
            <Button size="sm" variant="outline" className="mt-2 w-full">Send Email</Button>
          </Card>
        </div>

        {/* Submit Ticket */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Submit Support Ticket
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing & Subscription</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={ticketForm.email}
                onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Please describe your issue in detail..."
                rows={4}
                value={ticketForm.description}
                onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Button onClick={handleSubmitTicket} className="w-full">
              Submit Ticket
            </Button>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> support@mealplanner.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};