-- Create verification-docs storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for verification documents
CREATE POLICY "Users can upload their own verification docs" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'verification-docs' AND 
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can view their own verification docs" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'verification-docs' AND 
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can update their own verification docs" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'verification-docs' AND 
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can delete their own verification docs" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'verification-docs' AND 
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Admin policy
CREATE POLICY "Admins can view all verification docs" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'verification-docs' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE (user_id = auth.uid() OR id = auth.uid()) 
    AND role IN ('admin', 'super_admin')
  )
);
