-- =====================================================
-- Seed Sample Products Data
-- =====================================================
-- This script populates the products table with sample products
-- Run this in the Supabase SQL Editor AFTER running seed-categories.sql

-- First, let's get a sample user ID (you may need to adjust this based on your users)
-- If you don't have users yet, you'll need to create one first

-- Create a sample seller profile if it doesn't exist
DO $$
DECLARE 
  sample_user_id UUID;
  cat_books UUID;
  cat_electronics UUID;
  cat_clothing UUID;
  cat_furniture UUID;
  cat_sports UUID;
  product_id UUID;
BEGIN
  -- Get or create a sample user
  -- You may need to adjust this based on your actual user data
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  -- If no user exists, you'll need to create one manually first
  IF sample_user_id IS NULL THEN
    RAISE NOTICE 'No users found. Please create a user account first.';
    RETURN;
  END IF;

  -- Get category IDs
  SELECT id INTO cat_books FROM categories WHERE name = 'Books & Study Material';
  SELECT id INTO cat_electronics FROM categories WHERE name = 'Electronics';
  SELECT id INTO cat_clothing FROM categories WHERE name = 'Clothing & Fashion';
  SELECT id INTO cat_furniture FROM categories WHERE name = 'Furniture';
  SELECT id INTO cat_sports FROM categories WHERE name = 'Sports & Fitness';

  -- Insert sample products
  
  -- Books
  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Engineering Mathematics - Kreyszig', 'Advanced Engineering Mathematics 10th Edition. Excellent condition, no markings.', 
     cat_books, 'like_new', 'sell', 450, sample_user_id, 'available', 15)
  RETURNING id INTO product_id;
  
  INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600', true, 0);

  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Data Structures & Algorithms', 'Classic textbook by Cormen. Some highlighting but overall good condition.', 
     cat_books, 'good', 'sell', 350, sample_user_id, 'available', 8);

  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, rent_price_per_day, seller_id, status, views_count)
  VALUES 
    ('Organic Chemistry - Morrison Boyd', 'Standard organic chemistry textbook. Available for rent or purchase.', 
     cat_books, 'good', 'both', 400, 20, sample_user_id, 'available', 12);

  -- Electronics
  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count, is_featured)
  VALUES 
    ('Dell Inspiron 15 Laptop', '8GB RAM, 512GB SSD, Intel i5 11th Gen. Perfect for coding and assignments.', 
     cat_electronics, 'good', 'sell', 28000, sample_user_id, 'available', 45, true)
  RETURNING id INTO product_id;
  
  INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600', true, 0);

  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('JBL Bluetooth Speaker', 'Portable speaker with excellent bass. 10 hours battery life.', 
     cat_electronics, 'like_new', 'sell', 1800, sample_user_id, 'available', 22);

  INSERT INTO products (title, description, category_id, condition, listing_type, rent_price_per_day, rent_price_per_month, seller_id, status, views_count)
  VALUES 
    ('Scientific Calculator Casio fx-991ES', 'Essential for engineering exams. Available for rent.', 
     cat_electronics, 'new', 'rent', 10, 200, sample_user_id, 'available', 18);

  -- Clothing
  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Formal Blazer (Size M)', 'Navy blue formal blazer, worn twice for interviews. Perfect condition.', 
     cat_clothing, 'like_new', 'sell', 1500, sample_user_id, 'available', 10);

  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Winter Jacket - Unisex', 'Warm winter jacket, size L. Good for cold hostel nights.', 
     cat_clothing, 'good', 'sell', 800, sample_user_id, 'available', 5);

  -- Furniture
  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count, is_featured)
  VALUES 
    ('Study Table with Bookshelf', 'Wooden study table with attached bookshelf. Perfect for dorm rooms.', 
     cat_furniture, 'good', 'sell', 2500, sample_user_id, 'available', 30, true)
  RETURNING id INTO product_id;
  
  INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=600', true, 0);

  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Ergonomic Study Chair', 'Comfortable chair with lumbar support. Great for long study sessions.', 
     cat_furniture, 'like_new', 'sell', 1800, sample_user_id, 'available', 25);

  INSERT INTO products (title, description, category_id, condition, listing_type, rent_price_per_month, seller_id, status, views_count)
  VALUES 
    ('Mini Fridge', 'Compact refrigerator perfect for dorm room. Available for monthly rent.', 
     cat_furniture, 'good', 'rent', 500, sample_user_id, 'available', 40);

  -- Sports
  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Badminton Racket Set', 'Two rackets with shuttlecocks and carrying case.', 
     cat_sports, 'good', 'sell', 600, sample_user_id, 'available', 8);

  INSERT INTO products (title, description, category_id, condition, listing_type, sell_price, rent_price_per_day, seller_id, status, views_count)
  VALUES 
    ('Yoga Mat - Premium Quality', 'Thick yoga mat with carrying strap. Can rent for events.', 
     cat_sports, 'new', 'both', 400, 20, sample_user_id, 'available', 6);

  RAISE NOTICE 'Sample products created successfully!';
END $$;

-- Verify products were inserted
SELECT p.id, p.title, c.name as category, p.condition, p.listing_type, p.sell_price, p.status 
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC
LIMIT 20;

-- Count total products
SELECT COUNT(*) as total_products FROM products WHERE status = 'available';
