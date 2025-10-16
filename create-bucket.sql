-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-docs',
  'verification-docs', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE 
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create user_verifications table if not exists
CREATE TABLE IF NOT EXISTS public.user_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  document_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS if not already enabled
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own verifications" ON public.user_verifications;
CREATE POLICY "Users can view their own verifications" ON public.user_verifications
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own verifications" ON public.user_verifications;
CREATE POLICY "Users can insert their own verifications" ON public.user_verifications
FOR INSERT WITH CHECK (auth.uid() = user_id);
