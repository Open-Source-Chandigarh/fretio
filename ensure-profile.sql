-- Ensure profile exists for all auth users
INSERT INTO public.profiles (id, user_id, email, full_name)
SELECT 
  gen_random_uuid() as id,
  au.id as user_id, 
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL;
