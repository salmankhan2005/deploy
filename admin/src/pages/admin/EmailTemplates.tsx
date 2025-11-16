import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Edit, Eye, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailTemplates = () => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const [templates, setTemplates] = useState([
    { id: 1, name: "Welcome Email", subject: "Welcome to Meal Planner!", type: "User", status: "Active", lastUpdated: "2024-03-10" },
    { id: 2, name: "Recipe Approved", subject: "Your recipe has been approved!", type: "Recipe", status: "Active", lastUpdated: "2024-03-08" },
    { id: 3, name: "Subscription Renewal", subject: "Your subscription is renewing soon", type: "Billing", status: "Active", lastUpdated: "2024-03-05" },
    { id: 4, name: "Password Reset", subject: "Reset your password", type: "Security", status: "Active", lastUpdated: "2024-03-01" },
    { id: 5, name: "Weekly Meal Plan", subject: "Your weekly meal plan is ready!", type: "Meal Plan", status: "Active", lastUpdated: "2024-02-28" },
  ]);

  const handleSaveTemplate = (formData: any) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, ...formData, lastUpdated: new Date().toISOString().split('T')[0] } : t));
      toast({ title: "Template Updated", description: "Email template updated successfully" });
    } else {
      setTemplates([...templates, { id: Date.now(), ...formData, status: "Active", lastUpdated: new Date().toISOString().split('T')[0] }]);
      toast({ title: "Template Created", description: "New email template created successfully" });
    }
    setOpenDialog(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage automated email communications</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setEditingTemplate(null)}>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <EmailTemplateForm template={editingTemplate} onSave={handleSaveTemplate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">{template.type}</Badge>
                      <Badge variant={template.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{template.subject}</p>
                    <p className="text-xs text-muted-foreground">Last updated: {template.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                  <Dialog open={openDialog && editingTemplate?.id === template.id} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setEditingTemplate(template)}>
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <EmailTemplateForm template={template} onSave={handleSaveTemplate} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EmailTemplateForm = ({ template, onSave }: { template: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    subject: template?.subject || "",
    type: template?.type || "User",
    body: template?.body || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{template ? "Edit Email Template" : "Create Email Template"}</DialogTitle>
        <DialogDescription>
          {template ? "Update email template content" : "Create a new email template"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Welcome Email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Welcome to Meal Planner!"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Template Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="User"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Email Body</Label>
          <Textarea
            id="body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Enter email content here... Use {{name}}, {{email}} for dynamic variables"
            rows={10}
            required
          />
          <p className="text-xs text-muted-foreground">
            Available variables: {`{{name}}, {{email}}, {{link}}, {{date}}`}
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{template ? "Update" : "Create"} Template</Button>
      </DialogFooter>
    </form>
  );
};

export default EmailTemplates;
