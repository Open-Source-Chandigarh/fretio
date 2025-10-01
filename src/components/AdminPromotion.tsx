import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';

const AdminPromotion = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const promoteUserToAdmin = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter the user's email address.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', {
        user_email: email.trim()
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "User Promoted",
          description: `Successfully promoted ${email} to admin role.`,
        });
        setEmail('');
      } else {
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: `No user found with email: ${email}`,
        });
      }
    } catch (error) {
      console.error('Admin promotion error:', error);
      toast({
        variant: "destructive",
        title: "Promotion Failed",
        description: "Failed to promote user to admin. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Admin Promotion Tool</CardTitle>
        <CardDescription>
          Promote a user to admin role for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter user email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                promoteUserToAdmin();
              }
            }}
          />
        </div>
        
        <Button 
          onClick={promoteUserToAdmin}
          disabled={loading || !email.trim()}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Promote to Admin
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          This tool is for development/testing purposes only. 
          In production, admin roles should be managed through proper channels.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminPromotion;