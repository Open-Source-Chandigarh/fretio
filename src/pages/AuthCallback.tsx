import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the error and error_description from URL params
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          setError(errorDescription || error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: errorDescription || error,
          });
          
          // Redirect to login after showing error
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        // Check if we have a valid session after email confirmation
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          toast({
            title: "Email Verified!",
            description: "Your email has been verified successfully. Redirecting...",
          });
          
          // Redirect to home or complete profile based on profile status
          setTimeout(() => navigate('/'), 1500);
        } else {
          // No session found, redirect to login
          toast({
            title: "Verification Complete",
            description: "Please log in with your credentials.",
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('An error occurred during authentication');
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred during authentication. Please try again.",
        });
        
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {error ? 'Authentication Error' : 'Verifying Email'}
          </CardTitle>
          <CardDescription>
            {error ? 'There was a problem with your authentication' : 'Please wait while we verify your email...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {error ? (
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
