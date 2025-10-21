# Setup Instructions - Fix White Screen Issue

## Problem
After running `npm install` and `npm run dev`, you may see a white screen instead of the application.

## Cause
The application requires Supabase configuration to run properly. Without valid Supabase credentials in the `.env` file, the app will crash on startup showing only a white screen.

## Quick Fix (Development Only)
1. Create a `.env` file in the root directory (copy from `.env.example` if available)
2. Add these placeholder values to your `.env` file to see the UI:

```
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder
```

**Note**: This will allow the UI to load but database features won't work.

## Proper Solution
1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings → API in your Supabase dashboard
4. Copy your Project URL and anon public key
5. Update `.env` with your real credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   ```
6. Restart the development server: `npm run dev`

## Additional Setup
After setting up Supabase credentials, run the SQL scripts in the `supabase/` directory to set up your database schema.
