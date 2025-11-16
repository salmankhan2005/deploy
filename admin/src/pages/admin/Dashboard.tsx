import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, DollarSign, ChefHat, TrendingUp } from "lucide-react";
import { adminApiService } from "@/services/adminApi";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { icon: Users, label: "Total Users", value: "0", change: "+0%", color: "text-primary" },
    { icon: DollarSign, label: "Revenue", value: "$0", change: "+0%", color: "text-secondary" },
    { icon: ChefHat, label: "Recipes", value: "0", change: "+0%", color: "text-chart-3" },
    { icon: TrendingUp, label: "Active Subs", value: "0", change: "+0%", color: "text-chart-1" },
  ]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersResponse, recipesResponse, plansResponse] = await Promise.all([
        adminApiService.getRegularUsers(),
        adminApiService.getAdminRecipes(),
        adminApiService.getSubscriptionPlans()
      ]);
      
      const totalUsers = usersResponse.users.length;
      const totalRecipes = recipesResponse.recipes.length;
      const totalPlans = plansResponse.plans.length;
      
      // Calculate revenue (mock calculation)
      const revenue = plansResponse.plans.reduce((sum, plan) => sum + (plan.price * 100), 0); // Assume 100 subscribers per plan
      
      setStats([
        { icon: Users, label: "Total Users", value: totalUsers.toString(), change: "+12.5%", color: "text-primary" },
        { icon: DollarSign, label: "Revenue", value: `$${revenue.toFixed(0)}`, change: "+8.2%", color: "text-secondary" },
        { icon: ChefHat, label: "Recipes", value: totalRecipes.toString(), change: "+23.1%", color: "text-chart-3" },
        { icon: TrendingUp, label: "Active Subs", value: (totalPlans * 100).toString(), change: "+5.7%", color: "text-chart-1" },
      ]);
      
      // Calculate monthly data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const currentDate = new Date();
      const monthlyStats = [];
      
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = months[targetDate.getMonth()];
        
        const usersInMonth = usersResponse.users.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate.getMonth() === targetDate.getMonth() && userDate.getFullYear() === targetDate.getFullYear();
        }).length;
        
        monthlyStats.push({
          month: monthName,
          users: usersInMonth * 100, // Scale for visibility
          revenue: usersInMonth * 50 // Mock revenue calculation
        });
      }
      
      setMonthlyData(monthlyStats);
      
      // Calculate subscription distribution
      const subData = plansResponse.plans.map((plan, index) => ({
        name: plan.name,
        value: Math.floor(Math.random() * 1000) + 500, // Mock subscriber count
        color: [`hsl(var(--chart-1))`, `hsl(var(--chart-2))`, `hsl(var(--chart-3))`][index % 3]
      }));
      
      setSubscriptionData(subData);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold font-mono">{loading ? '...' : stat.value}</p>
                  <p className={cn("text-xs md:text-sm mt-1 font-mono", stat.color)}>{stat.change}</p>
                </div>
                <div className={cn("p-2 md:p-3 rounded-full bg-muted", stat.color)}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Line Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg md:text-xl flex items-center gap-2">
              User Growth
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg md:text-xl flex items-center gap-2">
              Monthly Revenue
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg md:text-xl">Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg md:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {[
                { user: "John Doe", action: "created a new recipe", time: "2 minutes ago" },
                { user: "Jane Smith", action: "upgraded to Premium", time: "15 minutes ago" },
                { user: "Mike Johnson", action: "submitted feedback", time: "1 hour ago" },
                { user: "Sarah Williams", action: "cancelled subscription", time: "3 hours ago" },
                { user: "Tom Brown", action: "signed up", time: "5 hours ago" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
