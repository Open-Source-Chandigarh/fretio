import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://gokuiwmiommnvexcckvs.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  console.log('You can find it at: https://supabase.com/dashboard/project/gokuiwmiommnvexcckvs/settings/api');
  console.log('Look for "service_role" key (keep it secret!)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSql() {
  try {
    const sql = fs.readFileSync('fix-production-profiles.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(s => s.trim());
    
    console.log('Executing SQL statements...');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        query: statement + ';' 
      });
      
      if (error) {
        console.error(`Error in statement ${i + 1}:`, error);
      } else {
        console.log(`✓ Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('\nAll statements executed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

executeSql();
