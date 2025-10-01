-- =====================================================
-- Seed Categories Data
-- =====================================================
-- This script populates the categories table with product categories
-- Run this in the Supabase SQL Editor

-- Delete existing categories (optional, remove if you want to keep existing data)
-- TRUNCATE TABLE categories CASCADE;

-- Insert product categories
INSERT INTO categories (name, description, icon) VALUES
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
  icon = EXCLUDED.icon;

-- Verify categories were inserted
SELECT id, name, icon, created_at 
FROM categories 
ORDER BY name;

-- Count total categories
SELECT COUNT(*) as total_categories FROM categories;
