import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";

const Support = () => {
  const tickets = [
    { id: "TICKET-001", user: "John Doe", subject: "Cannot reset password", priority: "High", status: "Open", created: "2 hours ago" },
    { id: "TICKET-002", user: "Jane Smith", subject: "Recipe not loading", priority: "Medium", status: "In Progress", created: "5 hours ago" },
    { id: "TICKET-003", user: "Mike Johnson", subject: "Subscription renewal issue", priority: "High", status: "Open", created: "1 day ago" },
    { id: "TICKET-004", user: "Sarah Williams", subject: "Feature request", priority: "Low", status: "Resolved", created: "2 days ago" },
    { id: "TICKET-005", user: "Tom Brown", subject: "App crashes on iOS", priority: "Critical", status: "In Progress", created: "3 days ago" },
  ];

  const logs = [
    { action: "User Login", user: "admin@test.com", timestamp: "2024-03-15 14:23:45", status: "Success" },
    { action: "Recipe Created", user: "chef@test.com", timestamp: "2024-03-15 13:45:12", status: "Success" },
    { action: "Payment Failed", user: "user@test.com", timestamp: "2024-03-15 12:30:00", status: "Error" },
    { action: "User Registration", user: "newuser@test.com", timestamp: "2024-03-15 11:15:23", status: "Success" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Support & Logs</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage support tickets and monitor system activity</p>
      </div>

      {/* Support Tickets */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg md:text-xl">
            <MessageSquare className="h-5 w-5" />
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{ticket.id}</p>
                      <p className="text-sm text-muted-foreground">{ticket.user}</p>
                    </div>
                    <Badge
                      variant={
                        ticket.status === "Resolved"
                          ? "default"
                          : ticket.status === "In Progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm">{ticket.subject}</p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        ticket.priority === "Critical" || ticket.priority === "High"
                          ? "destructive"
                          : ticket.priority === "Medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {ticket.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{ticket.created}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.user}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === "Critical" || ticket.priority === "High"
                            ? "destructive"
                            : ticket.priority === "Medium"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "Resolved"
                            ? "default"
                            : ticket.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.created}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg md:text-xl">
            <Clock className="h-5 w-5" />
            System Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 rounded-lg border">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className={`p-2 rounded-full shrink-0 ${log.status === "Success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    {log.status === "Success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm md:text-base">{log.action}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      {log.user} • {log.timestamp}
                    </p>
                  </div>
                </div>
                <Badge variant={log.status === "Success" ? "default" : "destructive"} className="text-xs self-start sm:self-center">
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
