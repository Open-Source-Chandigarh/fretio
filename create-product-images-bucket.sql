-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true, -- Make it public so images can be viewed
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE 
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create RLS policies for product-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own product images" ON storage.objects;

-- Allow authenticated users to upload product images to their folder
CREATE POLICY "Users can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Allow anyone to view product images (public access)
CREATE POLICY "Anyone can view product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Allow users to update their own product images
CREATE POLICY "Users can update their own product images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'product-images' AND 
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Allow users to delete their own product images
CREATE POLICY "Users can delete their own product images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'product-images' AND 
  auth.uid()::text = (string_to_array(name, '/'))[1]
);
