-- =====================================================
-- Temporarily Disable RLS for Testing
-- =====================================================
-- WARNING: Only use this for testing! Re-enable RLS for production

-- Check current RLS status
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'categories', 'product_images');

-- Temporarily disable RLS on these tables
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'categories', 'product_images');

-- Test query - this should return products
SELECT 
  p.id,
  p.title,
  p.status,
  c.name as category
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.status = 'available'
LIMIT 5;
