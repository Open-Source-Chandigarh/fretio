import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Flag, 
  Eye, 
  EyeOff, 
  Trash2, 
  Shield, 
  AlertTriangle,
  Search,
  Filter,
  MessageSquare
} from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReportedContent {
  id: string;
  type: 'product' | 'message' | 'profile';
  content_id: string;
  reporter_id: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  reporter?: {
    full_name: string;
    email: string;
  };
}

interface FlaggedProduct {
  id: string;
  title: string;
  description: string;
  seller: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
  status: 'available' | 'flagged' | 'draft';
  created_at: string;
}

const ContentModeration = () => {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [flaggedProducts, setFlaggedProducts] = useState<FlaggedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      
      // Get products data without complex joins
      const { data: products } = await supabase
        .from('products')
        .select('id, title, description, status, created_at, seller_id')
        .order('created_at', { ascending: false })
        .limit(20);

      if (products) {
        // Mock flagged products for demonstration
        const mockFlaggedProducts: FlaggedProduct[] = products
          .slice(0, 3)
          .map(product => ({
            id: product.id,
            title: product.title,
            description: product.description || '',
            seller: {
              full_name: 'John Seller',
              email: 'seller@example.com',
              avatar_url: ''
            },
            status: 'flagged' as const,
            created_at: product.created_at
          }));

        setFlaggedProducts(mockFlaggedProducts);
      }

      // Mock reported content for demonstration
      const mockReports: ReportedContent[] = [
        {
          id: '1',
          type: 'product',
          content_id: products?.[0]?.id || '',
          reporter_id: 'user1',
          reason: 'inappropriate_content',
          description: 'This product contains inappropriate images',
          status: 'pending',
          created_at: new Date().toISOString(),
          reporter: {
            full_name: 'Jane Reporter',
            email: 'reporter@example.com'
          }
        },
        {
          id: '2',
          type: 'message',
          content_id: 'msg1',
          reporter_id: 'user2',
          reason: 'spam',
          description: 'User is sending spam messages repeatedly',
          status: 'pending',
          created_at: new Date().toISOString(),
          reporter: {
            full_name: 'Bob User',
            email: 'bob@example.com'
          }
        },
        {
          id: '3',
          type: 'profile',
          content_id: 'profile1',
          reporter_id: 'user3',
          reason: 'harassment',
          description: 'User is harassing others in chat',
          status: 'reviewed',
          created_at: new Date().toISOString(),
          reporter: {
            full_name: 'Alice Reporter',
            email: 'alice@example.com'
          }
        }
      ];

      setReportedContent(mockReports);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load moderation data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (contentId: string, action: 'approve' | 'remove' | 'flag') => {
    try {
      if (action === 'remove') {
        const { error } = await supabase
          .from('products')
          .update({ status: 'draft' })
          .eq('id', contentId);

        if (error) throw error;
      }

      await fetchModerationData();
      toast({
        title: "Action Completed",
        description: `Content has been ${action}d successfully.`,
      });
    } catch (error) {
      console.error('Content moderation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform moderation action.",
      });
    }
  };

  const handleReportDecision = async (reportId: string, decision: 'resolved' | 'dismissed') => {
    try {
      // Update report status (mock implementation)
      setReportedContent(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: decision === 'resolved' ? 'resolved' : 'reviewed' }
            : report
        )
      );

      setSelectedReport(null);
      setModerationNotes('');

      toast({
        title: "Report Updated",
        description: `Report has been ${decision} successfully.`,
      });
    } catch (error) {
      console.error('Report decision error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update report status.",
      });
    }
  };

  const getReasonBadge = (reason: string) => {
    const reasonMap: Record<string, { label: string; variant: any }> = {
      inappropriate_content: { label: 'Inappropriate', variant: 'destructive' },
      spam: { label: 'Spam', variant: 'secondary' },
      harassment: { label: 'Harassment', variant: 'destructive' },
      fake_item: { label: 'Fake Item', variant: 'secondary' },
      other: { label: 'Other', variant: 'outline' }
    };

    const config = reasonMap[reason] || reasonMap.other;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredReports = reportedContent.filter(report => {
    const matchesSearch = report.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      report.reporter?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Moderation</h2>
        <p className="text-muted-foreground">Review reported content and manage platform safety</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportedContent.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flaggedProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportedContent.filter(r => r.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Actions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Reported Content</CardTitle>
          <CardDescription>Review and take action on reported items</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
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
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                    <Flag className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {report.type === 'product' ? 'Product Report' : 
                         report.type === 'message' ? 'Message Report' : 'Profile Report'}
                      </p>
                      {getReasonBadge(report.reason)}
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Reported by: {report.reporter?.full_name} • {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={report.status === 'pending' ? 'secondary' : 'default'}>
                    {report.status}
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setModerationNotes('');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review Report</DialogTitle>
                        <DialogDescription>
                          Take action on this reported content
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedReport && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Report Details</h4>
                            <div className="mt-2 p-3 bg-muted rounded-lg">
                              <p className="text-sm"><strong>Type:</strong> {selectedReport.type}</p>
                              <p className="text-sm"><strong>Reason:</strong> {selectedReport.reason.replace('_', ' ')}</p>
                              <p className="text-sm"><strong>Description:</strong> {selectedReport.description}</p>
                              <p className="text-sm"><strong>Reporter:</strong> {selectedReport.reporter?.full_name}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Moderation Notes</label>
                            <Textarea
                              placeholder="Add your moderation decision and reasoning..."
                              value={moderationNotes}
                              onChange={(e) => setModerationNotes(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <DialogFooter className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleReportDecision(selectedReport?.id || '', 'dismissed')}
                        >
                          Dismiss Report
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReportDecision(selectedReport?.id || '', 'resolved')}
                        >
                          Take Action
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reports found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flagged Products */}
      <Card>
        <CardHeader>
          <CardTitle>Flagged Products</CardTitle>
          <CardDescription>Products requiring manual review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flaggedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={product.seller.avatar_url} />
                    <AvatarFallback>
                      {product.seller.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      By {product.seller.full_name} • {product.seller.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentAction(product.id, 'approve')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleContentAction(product.id, 'remove')}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {flaggedProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No flagged products at this time.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModeration;