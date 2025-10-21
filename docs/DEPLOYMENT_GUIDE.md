# Fretio Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying Fretio to production environments. The application is designed to be deployed on modern hosting platforms with support for static site generation and serverless functions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Storage Setup](#storage-setup)
- [Build Process](#build-process)
- [Platform-Specific Deployment](#platform-specific-deployment)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts

- **Supabase Account**: [supabase.com](https://supabase.com) (Free tier available)
- **Hosting Platform**: Vercel, Netlify, or Cloudflare Pages
- **Domain Name**: (Optional) Custom domain for production
- **SMTP Provider**: (Optional) For email verification

### Required Tools

- **Node.js**: Version 18.0 or higher
- **npm/yarn**: Package manager
- **Git**: Version control
- **Supabase CLI**: (Optional) For local development

### System Requirements

- **Memory**: Minimum 512MB RAM
- **Storage**: 1GB for build artifacts
- **Network**: Stable internet connection
- **Browser**: Modern browser for testing

## Environment Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/Mayanks584/fretio.git
cd fretio

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# === REQUIRED ===
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# === OPTIONAL ===
# SMS Provider (use "mock" for development)
VITE_SMS_PROVIDER=mock  # Options: mock, twilio

# Twilio Configuration (if using Twilio)
VITE_TWILIO_ACCOUNT_SID=your-account-sid
VITE_TWILIO_AUTH_TOKEN=your-auth-token
VITE_TWILIO_PHONE_NUMBER=+1234567890

# Application URL
VITE_APP_URL=https://your-domain.com
```

### 3. Configuration File

Update `src/config/configuration.ts`:

```typescript
const configuration = {
  supabase_url: import.meta.env.VITE_SUPABASE_URL,
  supabase_publishable_key: import.meta.env.VITE_SUPABASE_ANON_KEY,
  sms_provider: import.meta.env.VITE_SMS_PROVIDER || 'mock',
  app_url: import.meta.env.VITE_APP_URL || 'http://localhost:8080',
  // Add other configuration as needed
};

export default configuration;
```

## Database Configuration

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Choose organization and enter project details
4. Select region closest to your users
5. Set database password (save securely)
6. Wait for project creation (2-3 minutes)

### 2. Run Database Scripts

Execute SQL scripts in the Supabase SQL Editor in this order:

#### Step 1: Storage Setup
```sql
-- Run: supabase/setup-storage.sql
-- This creates storage buckets and RLS policies
```

#### Step 2: Categories Data
```sql
-- Run: supabase/seed-categories.sql
-- This populates product categories
```

#### Step 3: Universities & Hostels
```sql
-- Run: supabase/seed-universities-hostels.sql
-- This populates university and hostel data
```

#### Step 4: Product Images Bucket
```sql
-- Run: create-product-images-bucket.sql
-- This creates the product images storage bucket
```

#### Step 5: Verification (Optional)
```sql
-- Run: supabase/verify-setup.sql
-- This verifies the database setup
```

### 3. Configure Authentication

1. Go to **Authentication > Settings** in Supabase Dashboard
2. Configure **Site URL**: `https://your-domain.com`
3. Add **Redirect URLs**:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:8080/auth/callback` (for development)
4. Enable **Email** provider
5. Configure **SMTP** (optional, for production)

### 4. Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ... (see Database Schema docs for complete policies)
```

## Storage Setup

### 1. Verification Documents Bucket

```sql
-- Create private bucket for verification documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-docs', 'verification-docs', false);

-- Set RLS policies
CREATE POLICY "Users can upload own verification docs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-docs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own verification docs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-docs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 2. Product Images Bucket

```sql
-- Create public bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Set RLS policies
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 3. Configure CORS

```sql
-- Allow CORS for image uploads
UPDATE storage.buckets 
SET cors = '[
  {
    "origin": ["https://your-domain.com", "http://localhost:8080"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "headers": ["*"],
    "maxAgeSeconds": 3600
  }
]'
WHERE id = 'product-images';
```

## Build Process

### 1. Development Build

```bash
# Start development server
npm run dev

# Build for development
npm run build:dev
```

### 2. Production Build

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm run test:run

# Build for production
npm run build
```

### 3. Build Optimization

The build process includes:

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Remove unused code
- **Minification**: Compress JavaScript and CSS
- **Image Optimization**: WebP conversion and compression
- **Bundle Analysis**: Check bundle size

### 4. Build Output

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
├── index.html
└── favicon.ico
```

## Platform-Specific Deployment

### Vercel (Recommended)

#### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub
4. Select the Fretio repository

#### 2. Configure Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

#### 3. Set Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SMS_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=your-account-sid
VITE_TWILIO_AUTH_TOKEN=your-auth-token
VITE_TWILIO_PHONE_NUMBER=+1234567890
VITE_APP_URL=https://your-domain.vercel.app
```

#### 4. Deploy

```bash
# Deploy to Vercel
vercel --prod

# Or push to main branch for automatic deployment
git push origin main
```

### Netlify

#### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect GitHub repository
4. Configure build settings

#### 2. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. Environment Variables

Set in Netlify Dashboard > Site Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SMS_PROVIDER=twilio
VITE_APP_URL=https://your-site.netlify.app
```

### Cloudflare Pages

#### 1. Connect Repository

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project"
3. Connect GitHub repository
4. Configure build settings

#### 2. Build Configuration

```
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
Node.js version: 18
```

#### 3. Environment Variables

Set in Cloudflare Pages > Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SMS_PROVIDER=twilio
VITE_APP_URL=https://your-site.pages.dev
```

## Post-Deployment Configuration

### 1. Update Supabase Settings

1. Go to Supabase Dashboard > Authentication > Settings
2. Update **Site URL** to your production domain
3. Add production **Redirect URLs**
4. Remove development URLs if not needed

### 2. Configure Custom Domain (Optional)

#### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Configure DNS settings

#### Cloudflare Pages
1. Go to Custom Domains
2. Add your domain
3. Configure DNS in Cloudflare

### 3. Set Up Monitoring

#### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

#### Analytics (Google Analytics)

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 4. Performance Optimization

#### Enable Compression

```javascript
// In vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

#### Set Up CDN

- **Vercel**: Automatic CDN included
- **Netlify**: Enable CDN in settings
- **Cloudflare**: Automatic with Cloudflare Pages

## Monitoring & Maintenance

### 1. Health Checks

Create a health check endpoint:

```typescript
// src/pages/HealthCheck.tsx
const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  
  useEffect(() => {
    // Check database connection
    supabase.from('profiles').select('count').then(() => {
      setStatus('healthy');
    }).catch(() => {
      setStatus('unhealthy');
    });
  }, []);
  
  return <div>Status: {status}</div>;
};
```

### 2. Database Monitoring

- Monitor query performance in Supabase Dashboard
- Set up alerts for slow queries
- Track storage usage
- Monitor RLS policy effectiveness

### 3. Application Monitoring

- Monitor error rates
- Track user engagement
- Monitor page load times
- Set up uptime monitoring

### 4. Regular Maintenance

#### Weekly Tasks
- Review error logs
- Check storage usage
- Monitor performance metrics
- Update dependencies

#### Monthly Tasks
- Security updates
- Database optimization
- Backup verification
- Performance analysis

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Database Connection Issues

1. Check Supabase URL and key
2. Verify RLS policies
3. Check network connectivity
4. Review Supabase logs

#### Image Upload Issues

1. Check storage bucket permissions
2. Verify CORS configuration
3. Check file size limits
4. Review storage policies

#### Authentication Issues

1. Check redirect URLs
2. Verify email configuration
3. Check JWT token expiration
4. Review auth policies

### Debug Mode

Enable debug mode for troubleshooting:

```env
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Logs and Monitoring

#### Supabase Logs
- Go to Supabase Dashboard > Logs
- Filter by error level
- Check API logs for issues

#### Application Logs
- Check browser console
- Use network tab for API calls
- Monitor performance tab

#### Hosting Platform Logs
- **Vercel**: Function logs in dashboard
- **Netlify**: Build logs and function logs
- **Cloudflare**: Analytics and logs

### Performance Issues

#### Slow Loading
1. Check bundle size
2. Optimize images
3. Enable compression
4. Use CDN

#### Database Slow Queries
1. Check indexes
2. Optimize queries
3. Review RLS policies
4. Consider caching

### Security Issues

#### RLS Policy Violations
1. Review policy definitions
2. Check user permissions
3. Test with different user roles
4. Monitor access logs

#### Authentication Bypass
1. Check auth middleware
2. Verify JWT validation
3. Review protected routes
4. Test edge cases

## Backup and Recovery

### Database Backups

Supabase provides automatic backups:
- **Free tier**: 7 days retention
- **Pro tier**: 30 days retention
- **Team tier**: 60 days retention

### Manual Backups

```bash
# Export database schema
pg_dump -h your-db-host -U postgres -d fretio > backup.sql

# Export specific tables
pg_dump -h your-db-host -U postgres -d fretio -t profiles > profiles_backup.sql
```

### Recovery Procedures

1. **Database Recovery**:
   - Restore from Supabase backups
   - Use manual backup files
   - Recreate from schema scripts

2. **Application Recovery**:
   - Redeploy from Git repository
   - Restore environment variables
   - Verify all integrations

3. **Storage Recovery**:
   - Restore from Supabase storage backups
   - Re-upload critical files
   - Verify file permissions

## Security Checklist

### Pre-Deployment
- [ ] Environment variables secured
- [ ] RLS policies configured
- [ ] CORS settings correct
- [ ] Authentication flow tested
- [ ] File upload restrictions set

### Post-Deployment
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Error messages sanitized
- [ ] Rate limiting enabled
- [ ] Monitoring alerts set

### Ongoing
- [ ] Regular security updates
- [ ] Dependency vulnerability scans
- [ ] Access log monitoring
- [ ] User data protection
- [ ] Incident response plan

---

*Last updated: January 2025*
*Version: 1.0.0*
