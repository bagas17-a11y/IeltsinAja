-- ============================================================
-- Past Papers Backend Migration
-- Secure storage for official IELTS past paper content
-- used to generate authentic practice questions.
-- ============================================================

-- ============================================================
-- 1. past_papers — metadata for each uploaded PDF
-- ============================================================
CREATE TABLE public.past_papers (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module      TEXT NOT NULL CHECK (module IN ('listening', 'reading', 'writing', 'speaking')),
  title       TEXT NOT NULL,
  filename    TEXT NOT NULL,
  storage_path TEXT,
  description TEXT,
  year        INTEGER,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;

-- Admins manage; authenticated users can read active records
CREATE POLICY "Admins can manage past papers"
  ON public.past_papers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view active past papers"
  ON public.past_papers FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE INDEX idx_past_papers_module ON public.past_papers(module);

CREATE TRIGGER update_past_papers_updated_at
  BEFORE UPDATE ON public.past_papers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. past_paper_questions — structured question patterns
--    extracted from each past paper PDF.
-- ============================================================
CREATE TABLE public.past_paper_questions (
  id             UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  past_paper_id  UUID REFERENCES public.past_papers(id) ON DELETE CASCADE,
  module         TEXT NOT NULL CHECK (module IN ('listening', 'reading', 'writing', 'speaking')),
  question_type  TEXT NOT NULL,   -- e.g. 'form_completion', 'multiple_choice', 'task2_essay'
  part           TEXT,            -- e.g. 'Part 1', 'Task 1', 'Section A'
  content        JSONB NOT NULL,  -- question data (prompt, options, answer_key, etc.)
  difficulty     TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.past_paper_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage past paper questions"
  ON public.past_paper_questions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view active past paper questions"
  ON public.past_paper_questions FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE INDEX idx_ppq_module ON public.past_paper_questions(module);
CREATE INDEX idx_ppq_question_type ON public.past_paper_questions(question_type);
CREATE INDEX idx_ppq_past_paper_id ON public.past_paper_questions(past_paper_id);

-- ============================================================
-- 3. Storage bucket for raw PDF uploads (admin-only write)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'past-papers',
  'past-papers',
  false,                          -- NOT public — requires signed URLs
  52428800,                       -- 50 MB max per file
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Only admins may upload/delete
CREATE POLICY "Admins can upload past papers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'past-papers'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete past papers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'past-papers'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update past papers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'past-papers'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- Authenticated users can download (read) via signed URL
CREATE POLICY "Authenticated users can download past papers"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'past-papers'
    AND auth.uid() IS NOT NULL
  );
