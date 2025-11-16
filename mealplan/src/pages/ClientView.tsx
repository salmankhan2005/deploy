import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Plus, Search, Calendar, Crown, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const clients = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah@email.com', 
    plan: 'Weight Loss Plan',
    status: 'Active',
    lastUpdated: '2 days ago'
  },
  { 
    id: 2, 
    name: 'Mike Chen', 
    email: 'mike@email.com', 
    plan: 'Muscle Building',
    status: 'Active',
    lastUpdated: '1 week ago'
  },
  { 
    id: 3, 
    name: 'Emma Davis', 
    email: 'emma@email.com', 
    plan: 'Diabetes Management',
    status: 'Inactive',
    lastUpdated: '2 weeks ago'
  },
];

export const ClientView = () => {
  const navigate = useNavigate();
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPlan, setClientPlan] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success(`Client ${clientName} added successfully`);
    setClientName('');
    setClientEmail('');
    setClientPlan('');
    setAddClientOpen(false);
  };

  const handleViewClient = (clientId: number) => {
    toast.info('Opening client meal plan...');
  };

  const handleEditClient = (clientId: number) => {
    toast.info('Edit client functionality');
  };

  const handleDeleteClient = (clientId: number, clientName: string) => {
    toast.success(`${clientName} removed from clients`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header 
        title="Client View" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Premium Feature Banner */}
        <Card className="p-6 bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-primary" />
            <h3 className="font-heading font-semibold text-primary">Professional Feature</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Manage meal plans for your clients. Perfect for nutritionists, dietitians, and meal planning professionals.
          </p>
          <Button className="w-full" onClick={() => navigate('/premium')}>
            Upgrade to Premium
          </Button>
        </Card>

        {/* Search and Add */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setAddClientOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Client Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-2xl font-bold text-primary">
              {clients.filter(c => c.status === 'Active').length}
            </h3>
            <p className="text-sm text-muted-foreground">Active Clients</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-2xl font-bold text-foreground">{clients.length}</h3>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-2xl font-bold text-secondary">12</h3>
            <p className="text-sm text-muted-foreground">Meal Plans Created</p>
          </Card>
        </div>

        {/* Client List */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Client Management
          </h3>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{client.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <p className="text-sm text-muted-foreground">Plan: {client.plan}</p>
                    <p className="text-xs text-muted-foreground">Last updated: {client.lastUpdated}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditClient(client.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteClient(client.id, client.name)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Client Dialog */}
        <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Client Name *</label>
                <Input
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email Address *</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meal Plan Type</label>
                <Select value={clientPlan} onValueChange={setClientPlan}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss Plan</SelectItem>
                    <SelectItem value="muscle-building">Muscle Building</SelectItem>
                    <SelectItem value="diabetes">Diabetes Management</SelectItem>
                    <SelectItem value="heart-healthy">Heart Healthy</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian Plan</SelectItem>
                    <SelectItem value="custom">Custom Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddClient} className="w-full">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};