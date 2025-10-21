import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const TestSupabase = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    const tests: any = {};

    try {
      // Test 1: Check if we can connect to Supabase
      tests.connection = 'Testing...';
      const { data: session } = await supabase.auth.getSession();
      tests.connection = session ? 'Connected (with session)' : 'Connected (no session)';

      // Test 2: Try to fetch categories without type checking
      try {
        const { data, error } = await (supabase as any)
          .from('categories')
          .select('*')
          .limit(5);
        
        if (error) {
          tests.categories = `Error: ${error.message}`;
        } else {
          tests.categories = `Success: Found ${data?.length || 0} categories`;
        }
      } catch (e: any) {
        tests.categories = `Exception: ${e.message}`;
      }

      // Test 3: Try to fetch products without type checking
      try {
        const { data, error } = await (supabase as any)
          .from('products')
          .select('*')
          .limit(5);
        
        if (error) {
          tests.products = `Error: ${error.message}`;
        } else {
          tests.products = `Success: Found ${data?.length || 0} products`;
        }
      } catch (e: any) {
        tests.products = `Exception: ${e.message}`;
      }

      // Test 4: Check Supabase URL and Key
      tests.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not set';
      tests.supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY 
        ? 'Set (hidden)' 
        : 'Not set';

    } catch (error: any) {
      tests.generalError = error.message;
    }

    setResults(tests);
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Testing...' : 'Re-test Connection'}
        </Button>

        <div className="bg-card border rounded-lg p-4 space-y-2">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b pb-2">
              <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
              <span className={
                typeof value === 'string' && value.includes('Error') 
                  ? 'text-red-500' 
                  : typeof value === 'string' && value.includes('Success')
                  ? 'text-green-500'
                  : ''
              }>
                {String(value)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>This page tests your Supabase connection and database access.</p>
          <p>If you see errors, check your .env file and Supabase configuration.</p>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;
