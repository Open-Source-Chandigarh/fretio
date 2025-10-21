# Fretio 🛍️

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/React-18.3-blue.svg" alt="React 18.3" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue.svg" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Supabase-Backend-green.svg" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vite-5.4-purple.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg" alt="TailwindCSS" />
</div>

<div align="center">
  <h3>A Modern Student Marketplace Platform for University Communities</h3>
  <p>Buy, sell, and trade items within your university community with real-time messaging, secure authentication, and a seamless user experience.</p>
</div>

---

## 📖 Table of Contents

- [🎯 About](#-about)
- [✨ Features](#-features)
- [🛍️ Demo](#-demo)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentation](#-documentation)
- [📁 Project Structure](#-project-structure)
- [🗝️ Database Schema](#%EF%B8%8F-database-schema)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)

## 🎯 About

Fretio is a comprehensive marketplace platform designed specifically for students to buy, sell, and trade items within their university community. It features real-time messaging, phone verification, product ratings, and a seamless user experience built with modern web technologies.

### Why Fretio?

- **University-Focused**: Built for students with hostel and university integration
- **Real-time Communication**: Instant messaging between buyers and sellers
- **Secure**: Phone verification and authentication via Supabase
- **Modern Stack**: Built with the latest React ecosystem tools
- **Responsive**: Works seamlessly on desktop and mobile devices

## ✨ Features

### 🎪 Core Marketplace Features
| Feature | Description |
|---------|-------------|
| **🛍️ Product Listings** | Create, edit, and manage product listings with multiple images |
| **📸 Image Management** | Bulk upload with WebP compression and lazy loading |
| **🌐 Category Navigation** | Browse products by categories with smart filtering |
| **🔍 Smart Search** | Real-time search with filters for price, condition, and location |
| **❤️ Favorites** | Save products for later and track price changes |
| **🏫 University Focus** | Filter by university and hostel locations |

### 🗣️ Communication & Social
| Feature | Description |
|---------|-------------|
| **💬 Real-time Chat** | Instant messaging between buyers and sellers |
| **🔔 Push Notifications** | Get alerts for messages, price drops, and new listings |
| **⭐ Rating System** | Build reputation through transaction ratings |
| **👤 User Profiles** | Detailed profiles with verification badges |
| **📱 SMS Verification** | Secure phone number verification via Twilio |

### 🌙 UI/UX Enhancements
| Feature | Description |
|---------|-------------|
| **🌙 Dark Mode** | System-aware theme with smooth transitions |
| **📱 Mobile Optimized** | Touch gestures, swipe navigation, bottom nav bar |
| **♾️ Accessibility** | WCAG compliant with screen reader support |
| **🎨 Modern Design** | Clean UI with Tailwind CSS and shadcn/ui |
| **⚡ Performance** | Lazy loading, code splitting, and optimized bundle |

### 🔧 Seller Tools
| Feature | Description |
|---------|-------------|
| **📦 Bulk Operations** | Manage multiple products at once |
| **📈 Inventory Dashboard** | Analytics and insights for your listings |
| **📊 CSV Import/Export** | Bulk upload products via spreadsheet |
| **💰 Price Management** | Bulk price adjustments and promotions |
| **📤 Draft Mode** | Save listings as drafts before publishing |

### 🔐 Admin Features
| Feature | Description |
|---------|-------------|
| **📊 Analytics Dashboard** | Platform metrics and user activity |
| **🛡️ Content Moderation** | Review and manage flagged content |
| **🎯 Product Promotion** | Feature products on homepage |
| **👥 User Management** | Manage accounts and permissions |

## 🛍️ Demo

### Live Demo
> 🌐 **Coming Soon** - Demo deployment in progress

### Screenshots

<details>
<summary>Click to view screenshots</summary>

#### Homepage
- Hero section with featured products
- Category grid for easy navigation
- Featured products carousel

#### Marketplace
- Advanced filtering options
- Grid/list view toggle
- Real-time search results

#### Product Details
- Image gallery with zoom
- Seller information
- Similar products suggestions

#### Mobile Experience
- Bottom navigation bar
- Swipeable product cards
- Touch-optimized interface

</details>

### Test Credentials
```
Demo accounts will be available once the live demo is deployed.
```

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

## 🚀 Quick Start

### Prerequisites

<table>
<tr>
<th>Requirement</th>
<th>Version</th>
<th>Download</th>
</tr>
<tr>
<td>Node.js</td>
<td>18.0+</td>
<td><a href="https://nodejs.org/">Download</a></td>
</tr>
<tr>
<td>npm/bun</td>
<td>9.0+ / 1.0+</td>
<td>Included with Node.js / <a href="https://bun.sh/">Bun</a></td>
</tr>
<tr>
<td>Git</td>
<td>Latest</td>
<td><a href="https://git-scm.com/">Download</a></td>
</tr>
<tr>
<td>Supabase</td>
<td>Account</td>
<td><a href="https://supabase.com/">Sign up free</a></td>
</tr>
<tr>
<td>Twilio (Optional)</td>
<td>Account</td>
<td><a href="https://www.twilio.com/try-twilio">Sign up</a></td>
</tr>
</table>

### 🌐 Installation Steps

#### 1️⃣ Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Coder-MayankSaini/fretio.git

# Navigate to project directory
cd fretio
```

#### 2️⃣ Install Dependencies

```bash
# Using npm (recommended)
npm install

# OR using bun (faster)
bun install

# OR using yarn
yarn install
```

#### 3️⃣ Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
```

<details>
<summary>🔑 Environment Variables Reference</summary>

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
VITE_APP_URL=http://localhost:8080
```

</details>

#### 4️⃣ Database Setup

<details>
<summary>🗝️ Supabase Database Configuration</summary>

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "New Project"
   - Fill in project details

2. **Run SQL Scripts** (in order)
   
   Navigate to SQL Editor in Supabase Dashboard and run:
   
   ```sql
   -- 1. Storage setup
   -- Run: supabase/setup-storage.sql
   
   -- 2. Categories seed data
   -- Run: supabase/seed-categories.sql
   
   -- 3. Universities & Hostels data  
   -- Run: supabase/seed-universities-hostels.sql
   
   -- 4. Verify installation (optional)
   -- Run: supabase/verify-setup.sql
   ```

3. **Configure Authentication**
   - Enable Email provider in Authentication settings
   - (Optional) Configure SMTP for email verification
   - See [Email Setup Guide](./SETUP_EMAIL_SMTP.md) for details

</details>

#### 5️⃣ Start Development Server

```bash
# Start the development server
npm run dev

# OR using bun
bun run dev
```

🎯 **Access the application at:** http://localhost:8080

### 🎲 Quick Setup (Development Only)

For a quick development setup without full Supabase configuration:

```bash
# 1. Clone and install
git clone https://github.com/Coder-MayankSaini/fretio.git
cd fretio
npm install

# 2. Use placeholder environment
cp .env.example .env
# Edit .env with placeholder values from SETUP_INSTRUCTIONS.md

# 3. Start development
npm run dev
```

> ⚠️ **Note:** This will show the UI but database features won't work without proper Supabase setup.

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
