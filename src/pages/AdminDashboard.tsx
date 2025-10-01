import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Header from '@/components/Header';
import { 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Loader2,
  Search,
  Filter,
  BarChart3,
  Flag
} from 'lucide-react';
import SystemAnalytics from '@/components/SystemAnalytics';
import ContentModeration from '@/components/ContentModeration';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UserVerificationData {
  id: string;
  user_id: string;
  document_url: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    avatar_url: string;
    phone_number: string;
    student_id: string;
  };
}

interface ProfileWithUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  role: 'student' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { profile, user } = useAuth();
  const [verifications, setVerifications] = useState<UserVerificationData[]>([]);
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<UserVerificationData | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processLoading, setProcessLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalProducts: 0,
    activeListings: 0,
    totalChats: 0,
    recentSignups: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      fetchVerifications();
      fetchProfiles();
      fetchAnalytics();
    }
  }, [profile]);

  const fetchVerifications = async () => {
    try {
      // First get verifications
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('user_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (verificationsError) throw verificationsError;

      if (!verificationsData || verificationsData.length === 0) {
        setVerifications([]);
        return;
      }

      // Get user IDs from verifications
      const userIds = verificationsData.map(v => v.user_id);

      // Get corresponding profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, avatar_url, phone_number, student_id')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData: UserVerificationData[] = verificationsData
        .map(verification => {
          const profile = profilesData?.find(p => p.user_id === verification.user_id);
          if (!profile) return null;
          
          return {
            ...verification,
            profiles: {
              full_name: profile.full_name || '',
              email: profile.email || '',
              avatar_url: profile.avatar_url || '',
              phone_number: profile.phone_number || '',
              student_id: profile.student_id || ''
            }
          };
        })
        .filter(Boolean) as UserVerificationData[];

      setVerifications(combinedData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load verification requests.",
      });
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, verification_status, role, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationDecision = async (verificationId: string, decision: 'verified' | 'rejected') => {
    if (!selectedVerification) return;

    setProcessLoading(true);
    try {
      // Update verification record
      const { error: verificationError } = await supabase
        .from('user_verifications')
        .update({
          status: decision,
          admin_notes: adminNotes,
          verified_by: user!.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (verificationError) throw verificationError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          verification_status: decision,
          is_active: decision === 'verified'
        })
        .eq('user_id', selectedVerification.user_id);

      if (profileError) throw profileError;

      await fetchVerifications();
      await fetchProfiles();
      setSelectedVerification(null);
      setAdminNotes('');

      toast({
        title: "Decision Recorded",
        description: `User verification ${decision === 'verified' ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error('Error processing verification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process verification decision.",
      });
    } finally {
      setProcessLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Get product statistics
      const { data: products } = await supabase
        .from('products')
        .select('id, status')
        .eq('status', 'available');

      // Get chat statistics
      const { data: chats } = await supabase
        .from('chats')
        .select('id');

      // Get recent signups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', sevenDaysAgo.toISOString());

      setAnalyticsData({
        totalProducts: products?.length || 0,
        activeListings: products?.length || 0,
        totalChats: chats?.length || 0,
        recentSignups: recentUsers?.length || 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate', userIds: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: action === 'activate' })
        .in('id', userIds);

      if (error) throw error;

      await fetchProfiles();
      toast({
        title: "Bulk Action Completed",
        description: `Successfully ${action}d ${userIds.length} users.`,
      });
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform bulk action.",
      });
    }
  };

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.profiles.full_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      verification.profiles.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const stats = {
    totalUsers: profiles.length,
    pendingVerifications: verifications.filter(v => v.status === 'pending').length,
    verifiedUsers: profiles.filter(p => p.verification_status === 'verified').length,
    activeUsers: profiles.filter(p => p.is_active).length
  };

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardHeader>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage user verifications and system settings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Extended Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalChats}</div>
                <p className="text-xs text-muted-foreground">Total conversations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.recentSignups}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="verifications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="verifications">Verification Queue</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
            </TabsList>

            <TabsContent value="verifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Verification Requests</CardTitle>
                  <CardDescription>
                    Review and approve student ID verifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredVerifications.map((verification) => (
                        <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={verification.profiles.avatar_url} />
                              <AvatarFallback>
                                {verification.profiles.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{verification.profiles.full_name}</p>
                              <p className="text-sm text-muted-foreground">{verification.profiles.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Student ID: {verification.profiles.student_id}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(verification.status)}
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVerification(verification);
                                    setAdminNotes(verification.admin_notes || '');
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Verification Request</DialogTitle>
                                  <DialogDescription>
                                    Review the student ID document and make a decision
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedVerification && (
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedVerification.profiles.avatar_url} />
                                        <AvatarFallback>
                                          {selectedVerification.profiles.full_name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="font-semibold">{selectedVerification.profiles.full_name}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedVerification.profiles.email}</p>
                                        <p className="text-sm">Student ID: {selectedVerification.profiles.student_id}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Student ID Document</Label>
                                      <div className="mt-2 p-4 border rounded-lg">
                                        <img
                                          src={selectedVerification.document_url}
                                          alt="Student ID"
                                          className="max-w-full max-h-64 object-contain mx-auto"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="adminNotes">Admin Notes</Label>
                                      <Textarea
                                        id="adminNotes"
                                        placeholder="Add notes about this verification request..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                )}

                                {selectedVerification?.status === 'pending' && (
                                  <DialogFooter className="flex space-x-2">
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleVerificationDecision(selectedVerification.id, 'rejected')}
                                      disabled={processLoading}
                                    >
                                      {processLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => handleVerificationDecision(selectedVerification.id, 'verified')}
                                      disabled={processLoading}
                                    >
                                      {processLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Approve
                                    </Button>
                                  </DialogFooter>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}

                      {filteredVerifications.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No verification requests found.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile.full_name}</p>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(profile.verification_status)}
                          <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{profile.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <SystemAnalytics />
            </TabsContent>

            <TabsContent value="moderation" className="space-y-4">
              <ContentModeration />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;