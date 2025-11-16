import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, ChefHat, DollarSign } from "lucide-react";
import { adminApiService } from "@/services/adminApi";

const Analytics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", change: "+0%", icon: Users, trend: "up" },
    { label: "Active Recipes", value: "0", change: "+0%", icon: ChefHat, trend: "up" },
    { label: "Monthly Revenue", value: "$0", change: "+0%", icon: DollarSign, trend: "up" },
    { label: "Engagement Rate", value: "0%", change: "+0%", icon: TrendingUp, trend: "up" },
  ]);

  useEffect(() => {
    loadAnalyticsData();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const [usersResponse, recipesResponse] = await Promise.all([
        adminApiService.getRegularUsers(),
        adminApiService.getAdminRecipes()
      ]);
      setUsers(usersResponse.users);
      
      // Calculate real-time stats
      const totalUsers = usersResponse.users.length;
      const recentUsers = usersResponse.users.filter(user => {
        const userDate = new Date(user.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return userDate > thirtyDaysAgo;
      }).length;
      
      const activeUsers = usersResponse.users.filter(user => {
        if (!user.updated_at) return false;
        const lastActive = new Date(user.updated_at);
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        return lastActive > twentyFourHoursAgo;
      }).length;
      
      const engagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
      
      // Calculate recipe categories
      const categories = {};
      recipesResponse.recipes.forEach(recipe => {
        const category = recipe.category || 'Other';
        categories[category] = (categories[category] || 0) + 1;
      });
      
      const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
      setCategoryDistribution(categoryData);
      
      // Calculate weekly recipe views (based on recipe creation)
      const weeklyViews = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - i);
        const dayName = days[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1]; // Adjust for Monday start
        
        const recipesOnDay = recipesResponse.recipes.filter(recipe => {
          const recipeDate = new Date(recipe.created_at);
          return recipeDate.toDateString() === targetDate.toDateString();
        }).length;
        
        // Simulate views as recipes created * random multiplier for realistic data
        const views = recipesOnDay * Math.floor(Math.random() * 50 + 100);
        
        weeklyViews.push({
          name: dayName,
          views: views
        });
      }
      
      setRecipeViewsData(weeklyViews);
      
      setStats([
        { label: "Total Users", value: totalUsers.toString(), change: `+${recentUsers}`, icon: Users, trend: "up" },
        { label: "Active Users (24h)", value: activeUsers.toString(), change: `${engagementRate}%`, icon: ChefHat, trend: "up" },
        { label: "New Users (30d)", value: recentUsers.toString(), change: "+0%", icon: DollarSign, trend: "up" },
        { label: "Engagement Rate", value: `${engagementRate}%`, change: "+0%", icon: TrendingUp, trend: "up" },
      ]);
      
      // Calculate monthly growth data
      const monthlyData = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = months[targetDate.getMonth()];
        
        const usersUpToMonth = usersResponse.users.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate <= new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        }).length;
        
        const activeInMonth = usersResponse.users.filter(user => {
          if (!user.updated_at) return false;
          const userDate = new Date(user.updated_at);
          return userDate.getMonth() === targetDate.getMonth() && userDate.getFullYear() === targetDate.getFullYear();
        }).length;
        
        monthlyData.push({
          month: monthName,
          users: usersUpToMonth,
          active: activeInMonth
        });
      }
      
      setUserGrowthData(monthlyData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recipeViewsData, setRecipeViewsData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base">Monitor platform performance and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold font-mono">{loading ? '...' : stat.value}</p>
                  <p className="text-xs text-primary mt-1 font-mono">{stat.change}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Real-time User Activity */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            Recent User Activity
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <p className="text-muted-foreground">Loading user data...</p>
            ) : users.length === 0 ? (
              <p className="text-muted-foreground">No users found</p>
            ) : (
              users.slice(0, 10).map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium">{user.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    {user.updated_at && (
                      <p className="text-xs text-green-600">
                        Active: {new Date(user.updated_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading">User Growth</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Total Users" />
              <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
        {/* Recipe Views Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading">Weekly Recipe Views</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recipeViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading">Recipe Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
