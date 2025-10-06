# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential Commands

### Development
```bash
# Start dev server (runs on localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run tests in watch mode (development)
npm test

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Code Quality
```bash
# Run ESLint
npm run lint
```

### Running Single Tests
```bash
# Run specific test file
npx vitest run src/services/__tests__/notificationService.test.ts

# Run tests matching pattern
npx vitest run --reporter=verbose --grep="NotificationService"
```

## Architecture Overview

### Core Structure
Fretio is a **student marketplace platform** built with React/TypeScript and Supabase. The architecture follows a modular pattern with clear separation of concerns:

**Frontend**: React 18 + TypeScript + Vite with shadcn/ui components and Tailwind CSS
**Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
**External Services**: Twilio for SMS verification

### Key Architectural Layers

1. **Pages** (`src/pages/`): Route-level components (Auth, Marketplace, Messages, etc.)
2. **Components** (`src/components/`): Reusable UI components, including shadcn/ui primitives
3. **Services** (`src/services/`): Business logic layer with external integrations
4. **Integrations** (`src/integrations/supabase/`): Database client and type definitions
5. **Contexts** (`src/contexts/`): React state management (AuthContext)
6. **Hooks** (`src/hooks/`): Custom React hooks for shared logic

### Data Flow Pattern
- **Authentication**: Supabase Auth → AuthContext → Protected routes
- **Data Management**: TanStack Query + Supabase client for server state
- **Real-time Features**: Supabase Realtime subscriptions for chat/notifications
- **Form Handling**: React Hook Form + Zod validation

### Key Database Tables
- `profiles`: User data with university/hostel associations
- `products`: Marketplace listings with category relationships  
- `messages`/`chats`: Real-time messaging system
- `notifications`: User notifications with preferences
- `favorites`: User saved products
- `universities`/`hostels`: Geographic/institutional data

### SMS Integration Architecture
The SMS system uses a provider pattern in `src/services/sms/`:
- `SMSProviderFactory.ts`: Factory for different providers (Twilio, Mock, AWS)
- `providers/`: Individual SMS provider implementations
- `smsService.ts`: Main SMS service interface

## Important Project Context

### Environment Setup
This project requires Supabase configuration and optionally Twilio for SMS. The `.env.example` shows required variables.

### Database Setup Sequence
Run these Supabase SQL scripts in order:
1. `supabase/setup-storage.sql` - Storage buckets
2. `supabase/seed-categories.sql` - Product categories
3. `supabase/seed-universities-hostels.sql` - University data

### Path Aliases
The project uses `@/*` alias for `src/*` imports (configured in tsconfig.json and vite.config.ts).

### Testing Strategy
- **Services**: Target 80%+ coverage (business logic)
- **Components**: Target 70%+ coverage  
- **Utilities**: Target 90%+ coverage
- Tests are co-located in `__tests__` directories next to source files

### Development Notes
- Dev server runs on port 8080 (not 5173)
- Uses Vite with SWC for fast builds
- TypeScript is configured with relaxed settings (`noImplicitAny: false`)
- ESLint includes React hooks and refresh plugins
- Vitest setup includes jsdom and React Testing Library

### Key Dependencies
- **UI**: shadcn/ui (Radix primitives) + Tailwind + Framer Motion
- **Data**: TanStack Query + Supabase client
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: Sonner (toasts)

### University-Focused Features
The platform is specifically designed for university marketplaces with:
- University and hostel filtering
- Student profile verification via phone
- Campus-specific product listings
- Hostel-to-hostel transactions
