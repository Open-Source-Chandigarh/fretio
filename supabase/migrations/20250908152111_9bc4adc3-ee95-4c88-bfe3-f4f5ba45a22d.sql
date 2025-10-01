-- Create an admin user for testing
-- This is temporary - in production, admin users should be created through proper channels
DO $$
DECLARE 
  admin_user_id UUID;
BEGIN
  -- Insert a test admin user (this won't work in production since we can't directly insert into auth.users)
  -- Instead, we'll update an existing user to be an admin
  
  -- First, let's create a function to promote a user to admin
  CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
  RETURNS BOOLEAN
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $function$
  BEGIN
    -- Update the user's role to admin
    UPDATE public.profiles 
    SET role = 'admin'
    WHERE email = user_email;
    
    -- Return true if a row was updated
    RETURN FOUND;
  END;
  $function$;
  
END $$;