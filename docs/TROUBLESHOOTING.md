# Fretio Troubleshooting Guide

## Overview

This guide helps you diagnose and resolve common issues with the Fretio application. It covers both development and production environments, with step-by-step solutions for various problems.

## Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Common Issues](#common-issues)
- [Development Issues](#development-issues)
- [Production Issues](#production-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Performance Issues](#performance-issues)
- [Mobile Issues](#mobile-issues)
- [Debugging Tools](#debugging-tools)
- [Getting Help](#getting-help)

## Quick Diagnosis

### Health Check Commands

```bash
# Check if the application starts
npm run dev

# Check if build succeeds
npm run build

# Check for linting errors
npm run lint

# Check for test failures
npm run test:run

# Check database connection
npm run test:supabase
```

### Common Symptoms

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| White screen | Missing env vars | Check `.env` file |
| Can't upload images | Storage bucket missing | Run storage setup SQL |
| Login fails | Auth config issue | Check Supabase settings |
| Slow loading | Large bundle size | Enable compression |
| Mobile issues | Touch events | Check mobile components |

## Common Issues

### 1. White Screen on Load

**Symptoms**: Page loads but shows blank white screen

**Causes**:
- Missing environment variables
- JavaScript errors
- Network connectivity issues
- Build configuration problems

**Solutions**:

1. **Check Environment Variables**:
   ```bash
   # Verify .env file exists and has required variables
   cat .env
   
   # Check if variables are loaded
   console.log(import.meta.env.VITE_SUPABASE_URL);
   ```

2. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Verify Build**:
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Check Network**:
   - Ensure internet connection
   - Check if Supabase is accessible
   - Verify firewall settings

### 2. Cannot Upload Images

**Symptoms**: Image upload fails or shows error

**Causes**:
- Storage bucket not created
- Incorrect RLS policies
- File size too large
- Network issues

**Solutions**:

1. **Check Storage Bucket**:
   ```sql
   -- Verify bucket exists
   SELECT * FROM storage.buckets WHERE id = 'product-images';
   ```

2. **Run Storage Setup**:
   ```sql
   -- Execute storage setup script
   \i create-product-images-bucket.sql
   ```

3. **Check File Size**:
   ```javascript
   // Check file size before upload
   if (file.size > 10 * 1024 * 1024) { // 10MB limit
     alert('File too large');
     return;
   }
   ```

4. **Verify RLS Policies**:
   ```sql
   -- Check storage policies
   SELECT * FROM pg_policies WHERE tablename = 'objects';
   ```

### 3. Authentication Not Working

**Symptoms**: Can't login, signup fails, or redirects don't work

**Causes**:
- Incorrect Supabase configuration
- Wrong redirect URLs
- Email verification issues
- RLS policy problems

**Solutions**:

1. **Check Supabase Configuration**:
   ```javascript
   // Verify Supabase client
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

2. **Verify Redirect URLs**:
   - Go to Supabase Dashboard > Authentication > Settings
   - Add your domain to redirect URLs
   - Include both HTTP and HTTPS versions

3. **Check Email Configuration**:
   ```javascript
   // Test email sending
   const { error } = await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'password123'
   });
   ```

4. **Review RLS Policies**:
   ```sql
   -- Check profiles table policies
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

### 4. Database Connection Issues

**Symptoms**: "Could not find table" errors, connection timeouts

**Causes**:
- Missing database tables
- Incorrect connection string
- Network connectivity
- RLS policy issues

**Solutions**:

1. **Check Table Existence**:
   ```sql
   -- List all tables
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Run Database Setup**:
   ```sql
   -- Execute setup scripts in order
   \i create-profiles-table.sql
   \i seed-categories.sql
   \i seed-universities-hostels.sql
   ```

3. **Verify Connection**:
   ```javascript
   // Test database connection
   const { data, error } = await supabase
     .from('profiles')
     .select('count')
     .limit(1);
   ```

4. **Check RLS Status**:
   ```sql
   -- Check if RLS is enabled
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

## Development Issues

### 1. Build Failures

**Symptoms**: `npm run build` fails with errors

**Common Causes**:
- TypeScript errors
- Missing dependencies
- Linting errors
- Memory issues

**Solutions**:

1. **Fix TypeScript Errors**:
   ```bash
   # Check TypeScript errors
   npx tsc --noEmit
   
   # Fix common issues
   # - Add missing type annotations
   # - Fix import statements
   # - Resolve type conflicts
   ```

2. **Update Dependencies**:
   ```bash
   # Update all dependencies
   npm update
   
   # Or update specific packages
   npm update @supabase/supabase-js react
   ```

3. **Fix Linting Errors**:
   ```bash
   # Run linter
   npm run lint
   
   # Auto-fix issues
   npm run lint -- --fix
   ```

4. **Increase Memory**:
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

### 2. Hot Reload Not Working

**Symptoms**: Changes don't reflect in browser

**Solutions**:

1. **Restart Dev Server**:
   ```bash
   # Stop and restart
   Ctrl+C
   npm run dev
   ```

2. **Clear Browser Cache**:
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache
   - Disable cache in DevTools

3. **Check File Watching**:
   ```bash
   # Check if files are being watched
   lsof -i :8080
   ```

### 3. Import Errors

**Symptoms**: Module not found errors

**Solutions**:

1. **Check Import Paths**:
   ```javascript
   // Use absolute imports
   import { Button } from "@/components/ui/button";
   
   // Not relative imports
   import { Button } from "../../components/ui/button";
   ```

2. **Verify File Existence**:
   ```bash
   # Check if file exists
   ls -la src/components/ui/button.tsx
   ```

3. **Check TypeScript Config**:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

## Production Issues

### 1. Deployment Failures

**Symptoms**: Build fails on hosting platform

**Solutions**:

1. **Check Build Logs**:
   - Review build output in hosting platform
   - Look for specific error messages
   - Check environment variables

2. **Verify Environment Variables**:
   ```bash
   # Ensure all required variables are set
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Check Node.js Version**:
   ```json
   // package.json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### 2. Performance Issues

**Symptoms**: Slow loading, high memory usage

**Solutions**:

1. **Enable Compression**:
   ```javascript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             ui: ['@radix-ui/react-dialog']
           }
         }
       }
     }
   });
   ```

2. **Optimize Images**:
   ```javascript
   // Use WebP format
   const optimizedImage = await compressImage(file, {
     quality: 0.8,
     format: 'webp'
   });
   ```

3. **Implement Lazy Loading**:
   ```javascript
   // Use LazyImage component
   <LazyImage src={imageUrl} alt="Description" />
   ```

### 3. CORS Issues

**Symptoms**: Cross-origin request blocked

**Solutions**:

1. **Check Supabase CORS**:
   ```sql
   -- Update storage bucket CORS
   UPDATE storage.buckets 
   SET cors = '[
     {
       "origin": ["https://your-domain.com"],
       "methods": ["GET", "POST", "PUT", "DELETE"],
       "headers": ["*"],
       "maxAgeSeconds": 3600
     }
   ]'
   WHERE id = 'product-images';
   ```

2. **Verify Domain Configuration**:
   - Check Supabase Dashboard > Settings > API
   - Add your domain to allowed origins
   - Update redirect URLs

## Database Issues

### 1. RLS Policy Violations

**Symptoms**: "Row Level Security" errors

**Solutions**:

1. **Check Policy Definitions**:
   ```sql
   -- List all policies
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

2. **Test Policies**:
   ```sql
   -- Test as different users
   SET LOCAL role TO authenticated;
   SET LOCAL "request.jwt.claims" TO '{"sub": "user-id"}';
   SELECT * FROM profiles;
   ```

3. **Fix Common Policy Issues**:
   ```sql
   -- Allow users to view their own profile
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = user_id);
   ```

### 2. Migration Issues

**Symptoms**: Schema changes not applied

**Solutions**:

1. **Check Migration Status**:
   ```sql
   -- Check if tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Run Migrations Manually**:
   ```sql
   -- Execute migration scripts
   \i create-profiles-table.sql
   \i create-product-images-bucket.sql
   ```

3. **Verify Data Integrity**:
   ```sql
   -- Check for missing data
   SELECT COUNT(*) FROM profiles;
   SELECT COUNT(*) FROM categories;
   SELECT COUNT(*) FROM products;
   ```

## Authentication Issues

### 1. Email Verification Not Working

**Symptoms**: Users can't verify email addresses

**Solutions**:

1. **Check SMTP Configuration**:
   - Go to Supabase Dashboard > Authentication > Settings
   - Configure SMTP settings
   - Test email sending

2. **Verify Redirect URLs**:
   ```javascript
   // Check redirect URL in signup
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
     options: {
       emailRedirectTo: `${window.location.origin}/auth/callback`
     }
   });
   ```

3. **Check Email Templates**:
   - Customize email templates in Supabase
   - Ensure templates include correct links
   - Test with different email providers

### 2. Session Management Issues

**Symptoms**: Users logged out unexpectedly

**Solutions**:

1. **Check Session Configuration**:
   ```javascript
   // Configure session persistence
   const supabase = createClient(url, key, {
     auth: {
       storage: localStorage,
       persistSession: true,
       autoRefreshToken: true
     }
   });
   ```

2. **Handle Token Refresh**:
   ```javascript
   // Listen for auth state changes
   supabase.auth.onAuthStateChange((event, session) => {
     if (event === 'TOKEN_REFRESHED') {
       console.log('Token refreshed');
     }
   });
   ```

## Performance Issues

### 1. Slow Database Queries

**Symptoms**: Long loading times, timeouts

**Solutions**:

1. **Add Indexes**:
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_products_category_status ON products(category_id, status);
   CREATE INDEX idx_products_created_at ON products(created_at DESC);
   ```

2. **Optimize Queries**:
   ```javascript
   // Use specific column selection
   const { data } = await supabase
     .from('products')
     .select('id, title, price, created_at')
     .eq('status', 'published')
     .limit(20);
   ```

3. **Implement Pagination**:
   ```javascript
   // Use range for pagination
   const { data } = await supabase
     .from('products')
     .select('*')
     .range(0, 9); // First 10 items
   ```

### 2. Large Bundle Size

**Symptoms**: Slow initial load, high bandwidth usage

**Solutions**:

1. **Analyze Bundle**:
   ```bash
   # Install bundle analyzer
   npm install --save-dev rollup-plugin-visualizer
   
   # Add to vite.config.ts
   import { visualizer } from 'rollup-plugin-visualizer';
   ```

2. **Code Splitting**:
   ```javascript
   // Lazy load components
   const LazyComponent = lazy(() => import('./LazyComponent'));
   ```

3. **Tree Shaking**:
   ```javascript
   // Import only what you need
   import { Button } from '@/components/ui/button';
   // Not: import * as UI from '@/components/ui';
   ```

## Mobile Issues

### 1. Touch Events Not Working

**Symptoms**: Swipes, taps not responding

**Solutions**:

1. **Check Touch Components**:
   ```javascript
   // Use touch-optimized components
   <TouchOptimizedProductCard {...props} />
   ```

2. **Verify CSS Touch Actions**:
   ```css
   .touchable {
     touch-action: manipulation;
     -webkit-touch-callout: none;
   }
   ```

3. **Test on Real Devices**:
   - Use actual mobile devices
   - Test different browsers
   - Check touch target sizes (min 44px)

### 2. Mobile Layout Issues

**Symptoms**: Content cut off, overlapping elements

**Solutions**:

1. **Check Responsive Design**:
   ```css
   /* Use responsive classes */
   .container {
     @apply px-4 sm:px-6 lg:px-8;
   }
   ```

2. **Test Breakpoints**:
   ```javascript
   // Use mobile hook
   const isMobile = useMobile();
   
   return (
     <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
       {content}
     </div>
   );
   ```

3. **Check Safe Areas**:
   ```css
   /* Respect device safe areas */
   .mobile-nav {
     padding-bottom: env(safe-area-inset-bottom);
   }
   ```

## Debugging Tools

### 1. Browser DevTools

**Console Commands**:
```javascript
// Check Supabase connection
console.log('Supabase:', supabase);

// Check auth state
console.log('User:', user);
console.log('Profile:', profile);

// Check environment variables
console.log('Env:', import.meta.env);
```

**Network Tab**:
- Monitor API requests
- Check response times
- Verify request headers
- Look for failed requests

### 2. Supabase Dashboard

**Logs Section**:
- API logs
- Auth logs
- Database logs
- Storage logs

**Database Section**:
- Query performance
- Table inspector
- RLS policy tester
- SQL editor

### 3. Application Logging

**Add Debug Logging**:
```javascript
// Enable debug mode
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

if (DEBUG) {
  console.log('Debug info:', data);
}
```

**Error Boundaries**:
```javascript
// Catch React errors
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
}
```

## Getting Help

### 1. Self-Help Resources

- **Documentation**: Check this troubleshooting guide
- **FAQ**: Review frequently asked questions
- **GitHub Issues**: Search existing issues
- **Community Forum**: Ask other users

### 2. Debug Information

When reporting issues, include:

```javascript
// System information
const debugInfo = {
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: new Date().toISOString(),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  version: import.meta.env.VITE_APP_VERSION
};
```

### 3. Contact Support

**Email**: support@fretio.com  
**GitHub**: Create an issue with debug information  
**Discord**: Join our community server  

### 4. Emergency Procedures

**Database Issues**:
1. Check Supabase status page
2. Verify connection string
3. Check RLS policies
4. Contact Supabase support

**Application Issues**:
1. Check hosting platform status
2. Verify environment variables
3. Review build logs
4. Rollback to previous version

**Security Issues**:
1. Disable affected features
2. Review access logs
3. Update security policies
4. Notify users if necessary

---

*Last updated: January 2025*
*Version: 1.0.0*
