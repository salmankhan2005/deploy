import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I create a meal plan?',
    answer: 'Navigate to the Home tab and tap the "Add Meal" button. Select a day, meal type, and choose from your saved recipes or create a new one.',
  },
  {
    question: 'Can I share recipes with others?',
    answer: 'Yes! Premium users can share recipes and meal plans with friends and family. Upgrade to Premium to unlock this feature.',
  },
  {
    question: 'How does the shopping list work?',
    answer: 'The shopping list automatically generates from your meal plan. All ingredients are organized by category for easy shopping.',
  },
  {
    question: 'What is Guest Mode?',
    answer: 'Guest Mode lets you explore FreshPlate without creating an account. However, your data won\'t be saved across devices.',
  },
  {
    question: 'How do I change my dietary preferences?',
    answer: 'Go to More > Profile > Settings > Preferences to update your dietary restrictions and preferences.',
  },
];

export const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Help & QA" 
        showNotifications={false} 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10 h-12"
          />
        </div>

        {/* FAQs */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-heading font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Contact Support */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4">Still need help?</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <span className="font-medium">Contact Support</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <span className="font-medium">Send Feedback</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
};
