# AI_PROJECT_MEMORY.md

## 🧩 Project Overview
**Project Name**: Fretio  
**Description**: A student-focused marketplace platform for university communities to buy, sell, and trade items  
**Tech Stack**: 
- Frontend: React, TypeScript, Vite, TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, Storage, Realtime)
- UI Components: shadcn/ui with Radix UI primitives
- State Management: TanStack Query + React Context
- SMS Integration: Twilio for phone verification

**Repository**: https://github.com/Mayanks584/fretio.git

## ⚙️ Environment Setup
**Required Dependencies**:
```bash
npm install  # Installs all packages from package.json
```

**Environment Variables** (`.env` file):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SMS_PROVIDER=mock  # For development
```

**Development Commands**:
```bash
npm run dev     # Start dev server (port 8080)
npm run build   # Build for production
npm run lint    # Run ESLint
npm run test    # Run tests
```

## ✅ Progress Log
**2025-01-16 13:20 UTC** - Repository rolled back to commit 4b75490:
- Clean state after adding SETUP_INSTRUCTIONS.md
- White screen issue fixed with placeholder Supabase credentials
- Base UI working properly
- Previous work on category links and profile completion was stashed

## 🔧 Current Focus / Active Task
**Working Branch**: `fix-category-links`  
**Current Status**: Starting fresh from clean state after rollback  
**Active Task**: Need to implement category page click behavior and product routing

## 🚀 Next Steps
1. **Fix category navigation**:
   - Make category cards clickable in CategoryGrid component
   - Add navigation to marketplace with category filter
   - Test category filtering in marketplace

2. **Complete profile flow**:
   - Fix university/hostel dropdowns
   - Handle profile completion without database errors
   - Ensure proper navigation after profile completion

3. **Database setup**:
   - Configure real Supabase instance
   - Run SQL scripts in `supabase/` directory
   - Update environment variables with real credentials

## 💡 AI Continuation Guide
To continue development on this project:

1. **Read this file first** for complete context
2. **Check current branch**: `git branch` (should be on `fix-category-links`)
3. **Start dev server**: `npm run dev`
4. **Current issues to fix**:
   - Category cards in homepage don't navigate anywhere
   - Profile completion needs proper handling without database
   - University/hostel dropdowns need to be populated

**Important Notes**:
- The app uses placeholder Supabase credentials for UI testing
- SMS provider is set to "mock" for development
- Real database integration requires Supabase setup

## 🗓️ Last Updated
**Date**: 2025-01-16 13:24 UTC  
**GitHub User**: Mayanks584  
**Last Action**: Created AI_PROJECT_MEMORY.md after repository rollback to commit 4b75490
