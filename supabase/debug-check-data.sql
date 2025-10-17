-- =====================================================
-- Debug Script - Check Database Data
-- =====================================================
-- Run this to see what data exists in your database

-- 1. Check if categories exist
SELECT 'CATEGORIES CHECK' as check_type;
SELECT COUNT(*) as total_categories FROM public.categories;
SELECT id, name FROM public.categories LIMIT 5;

-- 2. Check if products exist
SELECT 'PRODUCTS CHECK' as check_type;
SELECT COUNT(*) as total_products FROM public.products;
SELECT id, title, status, seller_id FROM public.products LIMIT 5;

-- 3. Check if product_images exist
SELECT 'PRODUCT IMAGES CHECK' as check_type;
SELECT COUNT(*) as total_images FROM public.product_images;

-- 4. Check if there are any users
SELECT 'USERS CHECK' as check_type;
SELECT COUNT(*) as total_users FROM auth.users;
SELECT id, email FROM auth.users LIMIT 1;

-- 5. Check products with their categories
SELECT 'PRODUCTS WITH CATEGORIES' as check_type;
SELECT 
  p.id,
  p.title,
  p.status,
  p.sell_price,
  c.name as category_name,
  p.seller_id,
  p.created_at
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY p.created_at DESC
LIMIT 10;

-- 6. Check RLS policies on products
SELECT 'RLS POLICIES CHECK' as check_type;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('products', 'categories', 'product_images');

-- 7. Check if RLS is enabled
SELECT 'RLS ENABLED CHECK' as check_type;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('products', 'categories', 'product_images');
