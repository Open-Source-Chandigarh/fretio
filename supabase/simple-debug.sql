-- =====================================================
-- Simple Debug - Check What Exists
-- =====================================================

-- 1. Check categories
SELECT COUNT(*) as total_categories FROM public.categories;

-- 2. Show first 5 categories
SELECT id, name FROM public.categories LIMIT 5;

-- 3. Check if products table exists and count
SELECT COUNT(*) as total_products FROM public.products;

-- 4. Show first 5 products (if any)
SELECT 
  p.id,
  p.title,
  p.status,
  p.sell_price,
  c.name as category
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LIMIT 5;

-- 5. Check for products with 'available' status
SELECT COUNT(*) as available_products 
FROM public.products 
WHERE status = 'available';

-- 6. Check if product_images table exists
SELECT COUNT(*) as total_images FROM public.product_images;
