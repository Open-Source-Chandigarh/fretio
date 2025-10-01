-- =====================================================
-- Verify Complete Supabase Setup
-- =====================================================
-- Run this to confirm everything is configured correctly

-- 1. Check Storage Buckets
SELECT 
  '=== STORAGE BUCKETS ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  'Bucket: ' || id as section,
  'Public: ' || public::text as detail_1,
  'Size Limit: ' || (file_size_limit / 1024 / 1024)::text || ' MB' as detail_2,
  'Created: ' || created_at::date::text as detail_3
FROM storage.buckets 
WHERE id IN ('product-images', 'avatars', 'verification-docs')
ORDER BY id;

-- 2. Check Storage Policies
SELECT 
  '=== STORAGE POLICIES ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  'Total Policies: ' || COUNT(*)::text as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 3. Check Categories
SELECT 
  '=== CATEGORIES ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  'Total Categories: ' || COUNT(*)::text as section,
  'First: ' || MIN(name) as detail_1,
  'Last: ' || MAX(name) as detail_2,
  NULL as detail_3
FROM categories;

-- Show first 5 categories
SELECT 
  '  - ' || name as section,
  icon as detail_1,
  SUBSTRING(description, 1, 40) || '...' as detail_2,
  NULL as detail_3
FROM categories
ORDER BY name
LIMIT 5;

-- 4. Check Universities
SELECT 
  '=== UNIVERSITIES ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  'Total Universities: ' || COUNT(*)::text as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3
FROM universities;

-- Show first 5 universities
SELECT 
  '  - ' || name as section,
  location as detail_1,
  domain as detail_2,
  NULL as detail_3
FROM universities
ORDER BY name
LIMIT 5;

-- 5. Check Hostels
SELECT 
  '=== HOSTELS ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  'Total Hostels: ' || COUNT(*)::text as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3
FROM hostels;

-- Hostels by university
SELECT 
  u.name as section,
  COUNT(h.id)::text || ' hostels' as detail_1,
  SUM(h.total_rooms)::text || ' total rooms' as detail_2,
  NULL as detail_3
FROM universities u
LEFT JOIN hostels h ON h.university_id = u.id
WHERE EXISTS (SELECT 1 FROM hostels WHERE university_id = u.id)
GROUP BY u.id, u.name
ORDER BY COUNT(h.id) DESC
LIMIT 5;

-- 6. FINAL SUMMARY
SELECT 
  '=== ✓ SETUP SUMMARY ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  'Storage Buckets' as section,
  COALESCE((SELECT COUNT(*)::text FROM storage.buckets WHERE id IN ('product-images', 'avatars', 'verification-docs')), '0') as detail_1,
  'Expected: 3' as detail_2,
  CASE 
    WHEN (SELECT COUNT(*) FROM storage.buckets WHERE id IN ('product-images', 'avatars', 'verification-docs')) = 3 
    THEN '✓ OK' 
    ELSE '✗ MISSING' 
  END as detail_3
UNION ALL
SELECT 
  'Categories' as section,
  COALESCE((SELECT COUNT(*)::text FROM categories), '0') as detail_1,
  'Expected: 25' as detail_2,
  CASE 
    WHEN (SELECT COUNT(*) FROM categories) = 25 
    THEN '✓ OK' 
    ELSE '✗ CHECK' 
  END as detail_3
UNION ALL
SELECT 
  'Universities' as section,
  COALESCE((SELECT COUNT(*)::text FROM universities), '0') as detail_1,
  'Expected: 21' as detail_2,
  CASE 
    WHEN (SELECT COUNT(*) FROM universities) = 21 
    THEN '✓ OK' 
    ELSE '✗ CHECK' 
  END as detail_3
UNION ALL
SELECT 
  'Hostels' as section,
  COALESCE((SELECT COUNT(*)::text FROM hostels), '0') as detail_1,
  'Expected: 44' as detail_2,
  CASE 
    WHEN (SELECT COUNT(*) FROM hostels) = 44 
    THEN '✓ OK' 
    ELSE '✗ CHECK' 
  END as detail_3;

-- 7. Next Steps
SELECT 
  '=== NEXT STEPS ===' as section,
  NULL as detail_1,
  NULL as detail_2,
  NULL as detail_3;

SELECT 
  '1. Create admin user' as section,
  'Sign up via app' as detail_1,
  NULL as detail_2,
  NULL as detail_3
UNION ALL
SELECT 
  '2. Promote to admin' as section,
  'UPDATE profiles SET role = ''super_admin''' as detail_1,
  'WHERE email = ''your@email.com''' as detail_2,
  NULL as detail_3
UNION ALL
SELECT 
  '3. Start dev server' as section,
  'npm run dev' as detail_1,
  NULL as detail_2,
  NULL as detail_3;
