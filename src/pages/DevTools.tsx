import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AdminPromotion from '@/components/AdminPromotion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Database, 
  Shield, 
  Users,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const DevTools = () => {
  const { profile, user } = useAuth();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Development Tools</h1>
            <p className="text-muted-foreground">
              Tools and utilities for development and testing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Current User Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Current User Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email:</span>
                  <span className="text-sm font-mono">{user?.email}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Role:</span>
                  <Badge variant="outline">{profile?.role}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification Status:</span>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(profile?.verification_status || '')}
                    <Badge 
                      variant={profile?.verification_status === 'verified' ? 'default' : 'secondary'}
                    >
                      {profile?.verification_status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verified:</span>
                  <Badge variant={profile?.phone_verified ? 'default' : 'secondary'}>
                    {profile?.phone_verified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Status:</span>
                  <Badge variant={profile?.is_active ? 'default' : 'destructive'}>
                    {profile?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Admin Promotion */}
            <div className="space-y-4">
              <AdminPromotion />
            </div>
          </div>

          {/* Implementation Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <CardTitle>Fretio Implementation Status</CardTitle>
              </div>
              <CardDescription>
                Track the progress of marketplace features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phase 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 1: Authentication Foundation ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ Database schema with 10 tables</li>
                      <li>✅ User authentication (email/password)</li>
                      <li>✅ Profile completion workflow</li>
                      <li>✅ University & hostel selection</li>
                      <li>✅ Document upload for verification</li>
                      <li>✅ Row Level Security policies</li>
                      <li>✅ Protected routes</li>
                    </ul>
                  </div>

                  {/* Phase 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 2: User Management ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ Mobile phone verification with OTP</li>
                      <li>✅ Profile management page</li>
                      <li>✅ Avatar upload functionality</li>
                      <li>✅ Admin verification dashboard</li>
                      <li>✅ Document review workflow</li>
                      <li>✅ Role-based access control</li>
                      <li>✅ Verification status tracking</li>
                    </ul>
                  </div>

                  {/* Phase 3 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 3: Product Management ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ Product listing forms</li>
                      <li>✅ Multi-image upload</li>
                      <li>✅ Buy vs Rent toggle</li>
                      <li>✅ Product detail pages</li>
                      <li>✅ Search and filtering</li>
                      <li>✅ Category management</li>
                    </ul>
                  </div>

                   {/* Phase 4 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 4: Real-time Chat ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ Real-time messaging</li>
                      <li>✅ Chat interface</li>
                      <li>✅ Message seller functionality</li>
                      <li>✅ Message history</li>
                      <li>✅ Chat conversation management</li>
                      <li>✅ Read receipts</li>
                    </ul>
                  </div>

                   {/* Phase 5 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 5: Reviews & Ratings ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ User rating system</li>
                      <li>✅ Review submission</li>
                      <li>✅ Rating display on products</li>
                      <li>✅ Review management page</li>
                      <li>✅ Star rating components</li>
                      <li>✅ Trust indicators</li>
                    </ul>
                  </div>

                  {/* Phase 6 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 6: Advanced Features ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ Favorites/Wishlist system</li>
                      <li>✅ Notification center</li>
                      <li>✅ Enhanced product interactions</li>
                      <li>✅ Recently viewed tracking</li>
                      <li>✅ Advanced user engagement</li>
                      <li>✅ Complete marketplace ecosystem</li>
                    </ul>
                  </div>

                  {/* Phase 7 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Phase 7: Admin Management ✅</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                      <li>✅ Advanced analytics dashboard</li>
                      <li>✅ System performance monitoring</li>
                      <li>✅ Content moderation tools</li>
                      <li>✅ User engagement metrics</li>
                      <li>✅ Bulk user management</li>
                      <li>✅ Platform health indicators</li>
                      <li>✅ Comprehensive admin controls</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DevTools;