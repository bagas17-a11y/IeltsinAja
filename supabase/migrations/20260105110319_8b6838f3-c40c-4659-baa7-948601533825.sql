-- Create storage bucket for question images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to view images (public bucket)
CREATE POLICY "Anyone can view question images"
ON storage.objects FOR SELECT
USING (bucket_id = 'question-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload question images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'question-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to update images
CREATE POLICY "Admins can update question images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'question-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete question images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'question-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);