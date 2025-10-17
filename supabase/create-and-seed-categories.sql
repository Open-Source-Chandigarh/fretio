-- =====================================================
-- Create Categories Table and Seed Data
-- =====================================================
-- This script creates the categories table and populates it with data
-- Run this in the Supabase SQL Editor

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to insert categories (optional)
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
CREATE POLICY "Authenticated users can insert categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert product categories (with ON CONFLICT to handle duplicates)
INSERT INTO public.categories (name, description, icon) VALUES
  ('Books & Study Material', 'Textbooks, reference books, notebooks, and study guides', '📚'),
  ('Electronics', 'Laptops, phones, tablets, chargers, and electronic gadgets', '💻'),
  ('Clothing & Fashion', 'Clothes, shoes, accessories, and fashion items', '👕'),
  ('Furniture', 'Study tables, chairs, shelves, beds, and room furniture', '🪑'),
  ('Sports & Fitness', 'Sports equipment, gym gear, yoga mats, and fitness accessories', '⚽'),
  ('Musical Instruments', 'Guitars, keyboards, drums, and other musical instruments', '🎸'),
  ('Kitchen & Appliances', 'Kettles, microwaves, utensils, and kitchen items', '🍳'),
  ('Bikes & Vehicles', 'Bicycles, scooters, and vehicle accessories', '🚲'),
  ('Gaming', 'Gaming consoles, controllers, games, and gaming accessories', '🎮'),
  ('Stationery', 'Pens, pencils, files, and office supplies', '✏️'),
  ('Art & Craft', 'Art supplies, craft materials, and creative tools', '🎨'),
  ('Laboratory Equipment', 'Lab coats, safety gear, and scientific equipment', '🔬'),
  ('Photography', 'Cameras, tripods, lenses, and photography gear', '📷'),
  ('Accommodation Essentials', 'Bedsheets, pillows, curtains, and room essentials', '🛏️'),
  ('Beauty & Personal Care', 'Cosmetics, grooming products, and personal care items', '💄'),
  ('Tools & Hardware', 'Hand tools, repair kits, and hardware items', '🔧'),
  ('Bags & Luggage', 'Backpacks, suitcases, laptop bags, and travel bags', '🎒'),
  ('Computer Accessories', 'Mouse, keyboard, USB drives, headphones, and peripherals', '⌨️'),
  ('Watches & Jewelry', 'Watches, bracelets, rings, and jewelry items', '⌚'),
  ('Food & Snacks', 'Packaged food, snacks, and beverages (non-perishable)', '🍿'),
  ('Board Games & Puzzles', 'Card games, board games, puzzles, and entertainment', '🎲'),
  ('Electrical Items', 'Extension cords, adapters, bulbs, and electrical supplies', '🔌'),
  ('Medical & Health', 'First aid kits, medicines, health monitors', '💊'),
  ('Hobbies & Collections', 'Collectibles, hobby materials, and special interest items', '🎭'),
  ('Other', 'Items that don''t fit into other categories', '📦')
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  updated_at = timezone('utc'::text, now());

-- Verify categories were inserted
SELECT id, name, icon, created_at 
FROM public.categories 
ORDER BY name;

-- Count total categories
SELECT COUNT(*) as total_categories FROM public.categories;
