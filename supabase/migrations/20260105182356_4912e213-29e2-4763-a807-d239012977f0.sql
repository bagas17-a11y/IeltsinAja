-- Create listening_library table for admin-uploaded listening tests
CREATE TABLE public.listening_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT,
  questions JSONB NOT NULL,
  answer_key JSONB NOT NULL,
  ai_secret_context TEXT DEFAULT 'If the answer is a number, allow both digits and words (e.g., 7 or seven). Ignore capitalization differences.',
  difficulty TEXT DEFAULT 'medium',
  duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listening_library ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage library
CREATE POLICY "Admins can manage listening library"
ON public.listening_library
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to view active listening tests
CREATE POLICY "Users can view active listening tests"
ON public.listening_library
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_listening_library_updated_at
BEFORE UPDATE ON public.listening_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create listening_submissions table to track user attempts
CREATE TABLE public.listening_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listening_id UUID REFERENCES public.listening_library(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER,
  total_questions INTEGER,
  band_score NUMERIC,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listening_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view their own listening submissions"
ON public.listening_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "Users can create their own listening submissions"
ON public.listening_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update their own listening submissions"
ON public.listening_submissions
FOR UPDATE
USING (auth.uid() = user_id);