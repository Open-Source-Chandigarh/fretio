# Fretio Database Schema

## Overview

Fretio uses Supabase (PostgreSQL) as its backend database. This document provides comprehensive documentation of the database schema, relationships, and data structures.

## Table of Contents

- [Database Overview](#database-overview)
- [Core Tables](#core-tables)
- [Storage Buckets](#storage-buckets)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Triggers & Functions](#triggers--functions)
- [Data Types](#data-types)
- [Migration Scripts](#migration-scripts)

## Database Overview

**Database**: PostgreSQL (via Supabase)  
**Version**: 15+  
**Extensions**: uuid-ossp, pgcrypto  
**Authentication**: Supabase Auth integration  

## Core Tables

### profiles
**Purpose**: User profile information and verification status

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  university_id UUID,
  hostel_id UUID,
  room_number TEXT,
  student_id TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `user_id`: Foreign key to auth.users
- `email`: User's email address
- `full_name`: Display name
- `avatar_url`: Profile picture URL
- `phone_number`: Contact number
- `phone_verified`: SMS verification status
- `university_id`: University reference
- `hostel_id`: Hostel reference
- `room_number`: Room number
- `student_id`: Student ID number
- `role`: User role (student/admin/super_admin)
- `verification_status`: Document verification status
- `is_active`: Account status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### products
**Purpose**: Product listings and details

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold', 'archived')),
  sell_price DECIMAL(10,2),
  rent_price_per_day DECIMAL(10,2),
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `seller_id`: Foreign key to profiles
- `title`: Product name
- `description`: Detailed description
- `category_id`: Foreign key to categories
- `condition`: Item condition
- `status`: Listing status
- `sell_price`: Selling price
- `rent_price_per_day`: Daily rental price
- `is_featured`: Featured listing flag
- `views_count`: View counter
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### categories
**Purpose**: Product categories and classification

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `name`: Category name
- `description`: Category description
- `icon`: Icon identifier
- `color`: Theme color
- `sort_order`: Display order
- `is_active`: Active status
- `created_at`: Creation timestamp

### product_images
**Purpose**: Product image storage and metadata

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `product_id`: Foreign key to products
- `image_url`: Image file URL
- `is_primary`: Primary image flag
- `sort_order`: Display order
- `file_size`: File size in bytes
- `mime_type`: MIME type
- `created_at`: Creation timestamp

### universities
**Purpose**: University information

```sql
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `name`: University name
- `city`: City location
- `state`: State location
- `country`: Country (default: India)
- `is_active`: Active status
- `created_at`: Creation timestamp

### hostels
**Purpose**: Hostel information linked to universities

```sql
CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `university_id`: Foreign key to universities
- `name`: Hostel name
- `address`: Hostel address
- `is_active`: Active status
- `created_at`: Creation timestamp

### messages
**Purpose**: Real-time messaging between users

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  sender_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `chat_id`: Chat session identifier
- `sender_id`: Sender user ID
- `receiver_id`: Receiver user ID
- `content`: Message content
- `message_type`: Message type
- `is_read`: Read status
- `created_at`: Creation timestamp

### reviews
**Purpose**: Product reviews and ratings

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `product_id`: Foreign key to products
- `user_id`: Reviewer user ID
- `rating`: Rating (1-5 stars)
- `comment`: Review text
- `is_verified`: Verified purchase flag
- `created_at`: Creation timestamp

### favorites
**Purpose**: User's saved/favorited products

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

**Columns**:
- `id`: Primary key (UUID)
- `user_id`: User ID
- `product_id`: Product ID
- `created_at`: Creation timestamp

### notifications
**Purpose**: User notifications and alerts

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'price_drop', 'new_listing', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `user_id`: User ID
- `type`: Notification type
- `title`: Notification title
- `message`: Notification content
- `data`: Additional data (JSON)
- `is_read`: Read status
- `created_at`: Creation timestamp

### user_verifications
**Purpose**: Document verification tracking

```sql
CREATE TABLE user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  verified_by UUID REFERENCES profiles(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:
- `id`: Primary key (UUID)
- `user_id`: User ID
- `document_type`: Type of document
- `document_url`: Document file URL
- `status`: Verification status
- `admin_notes`: Admin comments
- `verified_by`: Admin who verified
- `verified_at`: Verification timestamp
- `created_at`: Creation timestamp

## Storage Buckets

### verification-docs
**Purpose**: Private storage for verification documents

```sql
-- Bucket configuration
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-docs', 'verification-docs', false);
```

**RLS Policies**:
- Users can only access their own documents
- Admins can access all documents
- Public access denied

### product-images
**Purpose**: Public storage for product images

```sql
-- Bucket configuration
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);
```

**RLS Policies**:
- Public read access
- Authenticated users can upload
- Users can only delete their own images

## Relationships

### Entity Relationship Diagram

```
profiles (1) ──< products (N)
profiles (1) ──< messages (N) [as sender]
profiles (1) ──< messages (N) [as receiver]
profiles (1) ──< reviews (N)
profiles (1) ──< favorites (N)
profiles (1) ──< notifications (N)
profiles (1) ──< user_verifications (N)

products (1) ──< product_images (N)
products (1) ──< reviews (N)
products (1) ──< favorites (N)

categories (1) ──< products (N)

universities (1) ──< hostels (N)
universities (1) ──< profiles (N)
hostels (1) ──< profiles (N)
```

### Foreign Key Constraints

```sql
-- Products
ALTER TABLE products ADD CONSTRAINT fk_products_seller 
  FOREIGN KEY (seller_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE products ADD CONSTRAINT fk_products_category 
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- Product Images
ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Messages
ALTER TABLE messages ADD CONSTRAINT fk_messages_sender 
  FOREIGN KEY (sender_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE messages ADD CONSTRAINT fk_messages_receiver 
  FOREIGN KEY (receiver_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

-- Reviews
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user 
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

-- Favorites
ALTER TABLE favorites ADD CONSTRAINT fk_favorites_user 
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE favorites ADD CONSTRAINT fk_favorites_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Notifications
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user 
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

-- User Verifications
ALTER TABLE user_verifications ADD CONSTRAINT fk_user_verifications_user 
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE user_verifications ADD CONSTRAINT fk_user_verifications_verified_by 
  FOREIGN KEY (verified_by) REFERENCES profiles(user_id);

-- Hostels
ALTER TABLE hostels ADD CONSTRAINT fk_hostels_university 
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE;
```

## Indexes

### Performance Indexes

```sql
-- Profiles
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX idx_profiles_university_id ON profiles(university_id);
CREATE INDEX idx_profiles_hostel_id ON profiles(hostel_id);

-- Products
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_views_count ON products(views_count DESC);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(sell_price);

-- Product Images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);
CREATE INDEX idx_product_images_sort_order ON product_images(sort_order);

-- Messages
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Favorites
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- User Verifications
CREATE INDEX idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX idx_user_verifications_status ON user_verifications(status);
```

### Composite Indexes

```sql
-- Messages chat lookup
CREATE INDEX idx_messages_chat_created ON messages(chat_id, created_at DESC);

-- Product search
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_products_seller_status ON products(seller_id, status);

-- User notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

## Row Level Security (RLS)

### Profiles Table

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

### Products Table

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for published products
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published');

-- Users can view their own products
CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = seller_id);

-- Users can insert their own products
CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Users can update their own products
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = seller_id);

-- Users can delete their own products
CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = seller_id);
```

### Messages Table

```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Users can insert messages they send
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they sent
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);
```

## Triggers & Functions

### Updated At Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Profile Creation Trigger

```sql
-- Function to create profile after user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### View Count Function

```sql
-- Function to increment product view count
CREATE OR REPLACE FUNCTION increment_product_views(product_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET views_count = views_count + 1 
  WHERE id = product_uuid;
END;
$$ language 'plpgsql';
```

## Data Types

### Custom Types

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('student', 'admin', 'super_admin');

-- Verification status
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Product condition
CREATE TYPE product_condition AS ENUM ('new', 'like_new', 'good', 'fair');

-- Product status
CREATE TYPE product_status AS ENUM ('draft', 'published', 'sold', 'archived');

-- Message type
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');

-- Notification type
CREATE TYPE notification_type AS ENUM ('message', 'price_drop', 'new_listing', 'system');
```

### JSONB Data

```sql
-- Notification data structure
{
  "chat_id": "uuid",
  "product_id": "uuid",
  "action": "string",
  "metadata": {}
}

-- User verification data
{
  "document_type": "student_id",
  "file_name": "student_id.jpg",
  "file_size": 1024000,
  "mime_type": "image/jpeg"
}
```

## Migration Scripts

### Setup Scripts

1. **create-profiles-table.sql** - Profiles table and RLS
2. **create-product-images-bucket.sql** - Product images storage
3. **seed-categories.sql** - Category data
4. **seed-universities-hostels.sql** - University and hostel data
5. **verify-setup.sql** - Verification queries

### Migration Order

```sql
-- 1. Create tables
\i create-profiles-table.sql

-- 2. Set up storage
\i create-product-images-bucket.sql

-- 3. Seed data
\i seed-categories.sql
\i seed-universities-hostels.sql

-- 4. Verify setup
\i verify-setup.sql
```

## Performance Considerations

### Query Optimization

- Use appropriate indexes for common queries
- Implement pagination for large result sets
- Use EXPLAIN ANALYZE to identify slow queries
- Consider materialized views for complex aggregations

### Storage Optimization

- Compress images before storage
- Use WebP format for better compression
- Implement CDN for image delivery
- Clean up orphaned files regularly

### Monitoring

- Monitor query performance
- Track storage usage
- Set up alerts for slow queries
- Monitor RLS policy effectiveness

---

*Last updated: January 2025*
*Version: 1.0.0*
