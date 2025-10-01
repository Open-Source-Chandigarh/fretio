-- Fix RLS policies for product_images table
CREATE POLICY "Users can view product images from their hostel" ON public.product_images
  FOR SELECT USING (
    product_id IN (
      SELECT p.id FROM public.products p
      JOIN public.profiles pr ON pr.user_id = auth.uid()
      WHERE p.hostel_id = pr.hostel_id AND p.status = 'available'
    )
  );

CREATE POLICY "Users can manage their own product images" ON public.product_images
  FOR ALL USING (
    product_id IN (
      SELECT id FROM public.products WHERE seller_id = auth.uid()
    )
  );

-- Fix the function search path issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Fix update function search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;