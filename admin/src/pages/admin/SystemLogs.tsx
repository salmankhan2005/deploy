import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Download, Filter, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

const SystemLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  
  const [logs] = useState([
    { id: 1, timestamp: "2024-01-15 10:30:25", level: "info", message: "User login successful", user: "john@example.com", ip: "192.168.1.100" },
    { id: 2, timestamp: "2024-01-15 10:28:15", level: "warning", message: "Failed login attempt", user: "unknown", ip: "192.168.1.105" },
    { id: 3, timestamp: "2024-01-15 10:25:10", level: "error", message: "Database connection timeout", user: "system", ip: "localhost" },
    { id: 4, timestamp: "2024-01-15 10:20:05", level: "info", message: "Recipe created successfully", user: "jane@example.com", ip: "192.168.1.102" },
    { id: 5, timestamp: "2024-01-15 10:15:30", level: "success", message: "Backup completed successfully", user: "system", ip: "localhost" },
    { id: 6, timestamp: "2024-01-15 10:10:45", level: "error", message: "Payment processing failed", user: "mike@example.com", ip: "192.168.1.103" },
    { id: 7, timestamp: "2024-01-15 10:05:20", level: "info", message: "Email notification sent", user: "system", ip: "localhost" },
    { id: 8, timestamp: "2024-01-15 10:00:15", level: "warning", message: "High CPU usage detected", user: "system", ip: "localhost" },
  ]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "error": return "destructive";
      case "warning": return "secondary";
      case "success": return "default";
      case "info": return "outline";
      default: return "outline";
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "Level", "Message", "User", "IP"],
      ...filteredLogs.map(log => [log.timestamp, log.level, log.message, log.user, log.ip])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const logStats = {
    total: logs.length,
    errors: logs.filter(l => l.level === "error").length,
    warnings: logs.filter(l => l.level === "warning").length,
    success: logs.filter(l => l.level === "success").length,
    info: logs.filter(l => l.level === "info").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">System Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor system activities and events</p>
        </div>
        <Button onClick={exportLogs} className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{logStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Logs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{logStats.errors}</p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{logStats.warnings}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{logStats.success}</p>
            <p className="text-sm text-muted-foreground">Success</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{logStats.info}</p>
            <p className="text-sm text-muted-foreground">Info</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;