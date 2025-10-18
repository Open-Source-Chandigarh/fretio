-- =====================================================
-- Simple Test - Add Products Without Dependencies
-- =====================================================
-- This script adds products without needing users or profiles

-- First, make sure we have categories
SELECT COUNT(*) as category_count FROM public.categories;

-- Get some category IDs
DO $$
DECLARE
  cat_books UUID;
  cat_electronics UUID;
  cat_clothing UUID;
  test_user_id UUID := gen_random_uuid(); -- Generate a fake user ID
BEGIN
  -- Get category IDs
  SELECT id INTO cat_books FROM public.categories WHERE name = 'Books & Study Material';
  SELECT id INTO cat_electronics FROM public.categories WHERE name = 'Electronics';
  SELECT id INTO cat_clothing FROM public.categories WHERE name = 'Clothing & Fashion';
  
  IF cat_books IS NULL THEN
    RAISE NOTICE 'Categories not found! Please run create-and-seed-categories.sql first';
    RETURN;
  END IF;

  -- Delete any test products to start fresh (optional)
  DELETE FROM public.products WHERE title LIKE 'TEST:%';
  
  -- Insert test products with a fake seller_id
  INSERT INTO public.products (
    title, 
    description, 
    category_id, 
    condition, 
    listing_type, 
    sell_price, 
    seller_id, 
    status, 
    views_count,
    created_at
  ) VALUES 
    ('TEST: Engineering Mathematics Book', 
     'Test product - Mathematics textbook in great condition', 
     cat_books, 
     'like_new', 
     'sell', 
     450, 
     test_user_id, 
     'available', 
     15,
     NOW()),
    
    ('TEST: Dell Laptop i5', 
     'Test product - Laptop for students', 
     cat_electronics, 
     'good', 
     'sell', 
     25000, 
     test_user_id, 
     'available', 
     30,
     NOW()),
    
    ('TEST: Winter Jacket', 
     'Test product - Warm jacket for cold weather', 
     cat_clothing, 
     'new', 
     'sell', 
     1200, 
     test_user_id, 
     'available', 
     8,
     NOW());
  
  RAISE NOTICE 'Test products created successfully!';
END $$;

-- Check if products were created
SELECT 'CHECKING PRODUCTS' as status;
SELECT 
  p.id,
  p.title,
  p.sell_price,
  p.status,
  c.name as category
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.title LIKE 'TEST:%'
ORDER BY p.created_at DESC;

-- Check total products
SELECT COUNT(*) as total_products FROM public.products WHERE status = 'available';
