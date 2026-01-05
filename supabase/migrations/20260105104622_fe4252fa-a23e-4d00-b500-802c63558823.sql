-- Create IELTS Library table for admin to manage questions and train AI
CREATE TABLE public.ielts_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL CHECK (task_type IN ('Task 1 Academic', 'Task 1 General', 'Task 2')),
  title TEXT NOT NULL,
  question_prompt TEXT NOT NULL,
  question_image_url TEXT,
  model_answer_band9 TEXT,
  ai_secret_context TEXT,
  target_keywords TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.ielts_library ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage library"
ON public.ielts_library
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- All authenticated users can view active questions
CREATE POLICY "Users can view active questions"
ON public.ielts_library
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_ielts_library_updated_at
BEFORE UPDATE ON public.ielts_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();