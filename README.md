# Fretio 🛍️

> A modern, student-focused marketplace platform built with React, TypeScript, and Supabase

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

Fretio is a comprehensive marketplace platform designed specifically for students to buy, sell, and trade items within their university community. It features real-time messaging, phone verification, product ratings, and a seamless user experience built with modern web technologies.

### Why Fretio?

- **University-Focused**: Built for students with hostel and university integration
- **Real-time Communication**: Instant messaging between buyers and sellers
- **Secure**: Phone verification and authentication via Supabase
- **Modern Stack**: Built with the latest React ecosystem tools
- **Responsive**: Works seamlessly on desktop and mobile devices

## ✨ Features

### Core Features
- 🛍️ **Product Marketplace**: Browse and list products across multiple categories
- 💬 **Real-time Messaging**: Chat with buyers/sellers instantly
- 👤 **User Profiles**: Comprehensive profiles with ratings and history
- 📱 **Phone Verification**: SMS-based authentication for security
- ⭐ **Reviews & Ratings**: Rate transactions and build reputation
- ❤️ **Favorites System**: Save products for later
- 🔔 **Notifications**: Real-time alerts for messages and product updates
- 🏫 **University Integration**: Filter by university and hostel
- 🔍 **Advanced Search**: Filter and search products efficiently
- 📸 **Image Upload**: Multiple product images with Supabase Storage

### Admin Features
- 📊 **Analytics Dashboard**: Monitor platform usage and trends
- 🛡️ **Content Moderation**: Review and manage flagged content
- 🎯 **Product Promotion**: Feature products on the homepage
- 👥 **User Management**: View and manage user accounts

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 5.4
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query) + React Context
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4 with animations
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (product images)
- **Real-time**: Supabase Realtime (messages, notifications)
- **SMS**: Twilio integration for phone verification

### Testing & Quality
- **Testing Framework**: Vitest 3.2
- **Component Testing**: React Testing Library
- **User Interaction Testing**: @testing-library/user-event
- **Linting**: ESLint with TypeScript support

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0+ or **bun** 1.0+ package manager
- **Git** for version control
- **Supabase Account** ([Sign up free](https://supabase.com/))
- **Twilio Account** (optional, for SMS verification)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Coder-MayankSaini/fretio.git
cd fretio
```

2. **Install dependencies**

```bash
npm install
# or using bun
bun install
```

3. **Set up environment variables**

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMS Configuration (Optional - for phone verification)
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=your_twilio_phone_number

# App Configuration
VITE_APP_URL=http://localhost:8080
```

4. **Set up Supabase database**

Run the SQL scripts in your Supabase SQL Editor in this order:

```bash
# 1. Set up storage buckets
supabase/setup-storage.sql

# 2. Seed categories
supabase/seed-categories.sql

# 3. Seed universities and hostels
supabase/seed-universities-hostels.sql

# 4. Verify setup (optional)
supabase/verify-setup.sql
```

5. **Start the development server**

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

### Quick Start with Bun (Alternative)

For faster installation and build times:

```bash
bun install
bun run dev
```

## 📁 Project Structure

```
fretio/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg          # Default product image
│   └── robots.txt
│
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── AdminPromotion.tsx   # Admin product promotion
│   │   ├── CategoryGrid.tsx     # Category display
│   │   ├── ContentModeration.tsx # Content moderation
│   │   ├── Header.tsx           # Main navigation
│   │   ├── HeroSection.tsx      # Landing page hero
│   │   ├── ProductCard.tsx      # Product list item
│   │   ├── ProtectedRoute.tsx   # Route authentication
│   │   ├── SystemAnalytics.tsx  # Admin analytics
│   │   └── UserRating.tsx       # Rating display
│   │
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile detection
│   │   ├── use-toast.ts         # Toast notifications
│   │   └── usePhoneVerification.ts # Phone verification
│   │
│   ├── integrations/            # External service integrations
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client setup
│   │       └── types.ts         # Database types
│   │
│   ├── lib/                     # Utility functions
│   │   └── utils.ts             # Helper functions
│   │
│   ├── pages/                   # Route components
│   │   ├── AdminDashboard.tsx   # Admin panel
│   │   ├── Auth.tsx             # Authentication page
│   │   ├── CompleteProfile.tsx  # Profile setup
│   │   ├── CreateProduct.tsx    # Product creation
│   │   ├── DevTools.tsx         # Development utilities
│   │   ├── Favorites.tsx        # User favorites
│   │   ├── Index.tsx            # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── Marketplace.tsx      # Product listings
│   │   ├── Messages.tsx         # Chat interface
│   │   ├── MyProducts.tsx       # User's products
│   │   ├── NotFound.tsx         # 404 page
│   │   ├── Notifications.tsx    # Notifications page
│   │   ├── ProductDetail.tsx    # Product details
│   │   ├── Profile.tsx          # User profile
│   │   └── Reviews.tsx          # Product reviews
│   │
│   ├── services/                # Business logic
│   │   ├── sms/                 # SMS service providers
│   │   │   ├── providers/
│   │   │   │   ├── MockProvider.ts    # Mock SMS (dev)
│   │   │   │   └── TwilioProvider.ts  # Twilio integration
│   │   │   ├── SMSProviderFactory.ts  # Provider factory
│   │   │   └── types.ts               # SMS types
│   │   ├── notificationService.ts     # Notification logic
│   │   └── smsService.ts              # SMS logic
│   │
│   ├── test/                    # Test configuration
│   │   └── setup.ts             # Vitest setup
│   │
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
│
├── supabase/                    # Database scripts
│   ├── config.toml              # Supabase config
│   ├── seed-categories.sql      # Category data
│   ├── seed-universities-hostels.sql # University data
│   ├── setup-storage.sql        # Storage bucket setup
│   └── verify-setup.sql         # Verification queries
│
├── .env.example                 # Environment template
├── components.json              # shadcn/ui config
├── eslint.config.js             # ESLint configuration
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
└── vitest.config.ts             # Vitest configuration
```

## 🗄️ Database Schema

Fretio uses Supabase (PostgreSQL) with the following main tables:

### Core Tables

- **`profiles`**: User profiles with phone, university, and rating info
- **`products`**: Product listings with images, price, and details
- **`categories`**: Product categories (Electronics, Books, etc.)
- **`universities`**: University data
- **`hostels`**: Hostel data linked to universities
- **`messages`**: Real-time chat messages
- **`reviews`**: Product reviews and ratings
- **`favorites`**: User's saved products
- **`notifications`**: User notifications
- **`notification_preferences`**: User notification settings

### Key Relationships

```
profiles
  ├─> products (seller_id)
  ├─> messages (sender_id, receiver_id)
  ├─> reviews (user_id)
  └─> favorites (user_id)

products
  ├─> categories (category_id)
  ├─> reviews (product_id)
  └─> favorites (product_id)

profiles
  ├─> universities (university_id)
  └─> hostels (hostel_id)
```

### Storage Buckets

- **`product-images`**: Product photos (public access)
- **`avatars`**: User profile pictures (public access)

For detailed schema and setup scripts, see the `supabase/` directory.

## 🧪 Testing

### Running Tests

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Writing Tests

Tests are located in `__tests__` directories next to the code they test:

```typescript
// src/services/__tests__/notificationService.test.ts
import { describe, it, expect } from 'vitest';
import { notificationService } from '../notificationService';

describe('NotificationService', () => {
  it('should send notification successfully', async () => {
    const result = await notificationService.send({
      userId: 'test-user',
      type: 'message',
      title: 'Test',
      message: 'Test message'
    });
    
    expect(result.success).toBe(true);
  });
});
```

### Test Coverage Goals

- **Services**: 80%+ coverage
- **Components**: 70%+ coverage
- **Utilities**: 90%+ coverage

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build with development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:ui` | Run tests with UI |

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deployment Platforms

#### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically on push

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Netlify

1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

#### Cloudflare Pages

1. Connect your repository
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Add environment variables

### Environment Variables for Production

Ensure these are set in your deployment platform:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=your_twilio_phone
VITE_APP_URL=https://your-domain.com
```

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write/update tests
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow the ESLint configuration
- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Use functional components with hooks
- **Testing**: Write tests for new features
- **Commits**: Use clear, descriptive commit messages
- **Documentation**: Update README for significant changes

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Project Priorities

We're currently focusing on:

1. 🧪 Increasing test coverage
2. ♿ Improving accessibility
3. 🌐 Internationalization (i18n)
4. 📱 Progressive Web App (PWA) features
5. 🎨 UI/UX enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/Coder-MayankSaini/fretio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Coder-MayankSaini/fretio/discussions)

---

<p align="center">Made with ❤️ by the Fretio team</p>
