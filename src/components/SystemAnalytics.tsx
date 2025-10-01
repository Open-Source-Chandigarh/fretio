import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart,
  MessageSquare,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnalyticsData {
  userGrowth: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  productActivity: {
    totalListings: number;
    activeListings: number;
    soldItems: number;
  };
  engagement: {
    totalMessages: number;
    activeChats: number;
    avgResponseTime: number;
  };
  demographics: {
    byUniversity: Array<{ name: string; count: number }>;
    byVerificationStatus: Array<{ status: string; count: number }>;
  };
}

const SystemAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userGrowth: { current: 0, previous: 0, trend: 'stable' },
    productActivity: { totalListings: 0, activeListings: 0, soldItems: 0 },
    engagement: { totalMessages: 0, activeChats: 0, avgResponseTime: 0 },
    demographics: { byUniversity: [], byVerificationStatus: [] }
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date ranges
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const currentPeriodStart = new Date(now);
      currentPeriodStart.setDate(now.getDate() - daysBack);
      
      const previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setDate(currentPeriodStart.getDate() - daysBack);

      // Fetch user growth data
      const [currentUsers, previousUsers] = await Promise.all([
        supabase
          .from('profiles')
          .select('id')
          .gte('created_at', currentPeriodStart.toISOString()),
        supabase
          .from('profiles')
          .select('id')
          .gte('created_at', previousPeriodStart.toISOString())
          .lt('created_at', currentPeriodStart.toISOString())
      ]);

      // Fetch product activity
      const [products, activeProducts] = await Promise.all([
        supabase
          .from('products')
          .select('id, status'),
        supabase
          .from('products')
          .select('id')
          .eq('status', 'available')
      ]);

      // Fetch messaging data
      const [messages, chats] = await Promise.all([
        supabase
          .from('messages')
          .select('id')
          .gte('created_at', currentPeriodStart.toISOString()),
        supabase
          .from('chats')
          .select('id')
      ]);

      // Fetch demographics
      const [universitiesData, verificationData] = await Promise.all([
        supabase
          .from('profiles')
          .select(`
            university_id,
            universities:university_id (name)
          `),
        supabase
          .from('profiles')
          .select('verification_status')
      ]);

      // Process demographics data
      const universityStats = universitiesData.data?.reduce((acc: any, profile: any) => {
        const uniName = profile.universities?.name || 'Unknown';
        acc[uniName] = (acc[uniName] || 0) + 1;
        return acc;
      }, {});

      const verificationStats = verificationData.data?.reduce((acc: any, profile: any) => {
        acc[profile.verification_status] = (acc[profile.verification_status] || 0) + 1;
        return acc;
      }, {});

      const userGrowthTrend = (currentUsers.data?.length || 0) > (previousUsers.data?.length || 0) ? 'up' : 
        (currentUsers.data?.length || 0) < (previousUsers.data?.length || 0) ? 'down' : 'stable';

      setAnalyticsData({
        userGrowth: {
          current: currentUsers.data?.length || 0,
          previous: previousUsers.data?.length || 0,
          trend: userGrowthTrend
        },
        productActivity: {
          totalListings: products.data?.length || 0,
          activeListings: activeProducts.data?.length || 0,
          soldItems: products.data?.filter(p => p.status === 'sold').length || 0
        },
        engagement: {
          totalMessages: messages.data?.length || 0,
          activeChats: chats.data?.length || 0,
          avgResponseTime: 2.5 // Mock data - would need more complex calculation
        },
        demographics: {
          byUniversity: Object.entries(universityStats || {}).map(([name, count]) => ({ 
            name, 
            count: count as number 
          })),
          byVerificationStatus: Object.entries(verificationStats || {}).map(([status, count]) => ({ 
            status, 
            count: count as number 
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return '+100%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Analytics</h2>
          <p className="text-muted-foreground">Platform performance and growth metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Growth</CardTitle>
                {getTrendIcon(analyticsData.userGrowth.trend)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.userGrowth.current}</div>
                <p className="text-xs text-muted-foreground">
                  {getChangePercentage(analyticsData.userGrowth.current, analyticsData.userGrowth.previous)} from previous period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.productActivity.activeListings}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.productActivity.totalListings} total products
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.engagement.totalMessages}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.engagement.activeChats} active conversations
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Chat Activity</CardTitle>
                <CardDescription>Messaging and communication metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Messages</span>
                  <span className="font-semibold">{analyticsData.engagement.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Chats</span>
                  <span className="font-semibold">{analyticsData.engagement.activeChats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="font-semibold">{analyticsData.engagement.avgResponseTime}h</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Listing and sales metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Listings</span>
                  <span className="font-semibold">{analyticsData.productActivity.totalListings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Listings</span>
                  <span className="font-semibold">{analyticsData.productActivity.activeListings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sold Items</span>
                  <span className="font-semibold">{analyticsData.productActivity.soldItems}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Users by University</CardTitle>
                <CardDescription>Distribution across institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.demographics.byUniversity.map((uni) => (
                    <div key={uni.name} className="flex items-center justify-between">
                      <span className="text-sm">{uni.name}</span>
                      <Badge variant="outline">{uni.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>User verification breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.demographics.byVerificationStatus.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status.status}</span>
                      <Badge 
                        variant={status.status === 'verified' ? 'default' : 'secondary'}
                      >
                        {status.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemAnalytics;