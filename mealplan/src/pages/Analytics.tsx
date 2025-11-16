import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Clock, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const weeklyData = [
  { day: 'Mon', meals: 4 },
  { day: 'Tue', meals: 3 },
  { day: 'Wed', meals: 4 },
  { day: 'Thu', meals: 2 },
  { day: 'Fri', meals: 4 },
  { day: 'Sat', meals: 3 },
  { day: 'Sun', meals: 4 }
];

const mealTypeData = [
  { name: 'Breakfast', value: 30, color: '#8884d8' },
  { name: 'Lunch', value: 25, color: '#82ca9d' },
  { name: 'Dinner', value: 35, color: '#ffc658' },
  { name: 'Snacks', value: 10, color: '#ff7c7c' }
];

export const Analytics = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      const response = await apiService.getAnalytics();
      setAnalytics(response.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Analytics Dashboard" 
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      
      <main className="container-responsive py-6 space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Meal Plans</span>
            </div>
            <p className="text-2xl font-bold">{analytics?.meal_plan_actions || 0}</p>
            <p className="text-xs text-muted-foreground">Actions</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ChefHat className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Recipes</span>
            </div>
            <p className="text-2xl font-bold">{analytics?.recipe_actions || 0}</p>
            <p className="text-xs text-muted-foreground">Actions</p>
          </Card>
        </div>

        {/* Weekly Meal Planning */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Meal Planning</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Bar dataKey="meals" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Meal Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Meal Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mealTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {mealTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {mealTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : analytics?.recent_activity?.length > 0 ? (
            <div className="space-y-2">
              {analytics.recent_activity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm capitalize">{activity.event_type.replace('_', ' ')}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No activity yet. Start using the app to see analytics!</p>
          )}
        </Card>

        {/* Usage Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Events</span>
              <span className="font-medium">{analytics?.total_events || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Recipe Saves</span>
              <span className="font-medium">{analytics?.recipe_saves || 0}</span>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Consistent Planner</p>
              <p className="text-xs text-muted-foreground">7 days streak</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">Early Bird</p>
              <p className="text-xs text-muted-foreground">Plans ahead</p>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};