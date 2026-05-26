-- ============================================================
-- Listening Test Library — full Cambridge-style IELTS Academic
-- Listening tests (4 parts, 40 questions, 30 minutes).
-- ============================================================

CREATE TABLE public.listening_test_library (
  id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  difficulty       TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  total_questions  INTEGER NOT NULL DEFAULT 40,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  -- sections JSONB shape:
  -- [
  --   {
  --     "part_number": 1,
  --     "context": "...",
  --     "transcript": "SPEAKER: ...",
  --     "question_groups": [
  --       { "type": "form_completion", "title": "...", "instruction": "...", "question_range": [1, 8], "items": [...] },
  --       { "type": "multiple_choice", "instruction": "...", "question_range": [9, 10], "items": [...] }
  --     ]
  --   },
  --   ... part 2, part 3, part 4
  -- ]
  sections         JSONB NOT NULL,
  topic_tags       TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.listening_test_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage listening test library"
  ON public.listening_test_library FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view active listening tests"
  ON public.listening_test_library FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE INDEX idx_listening_test_library_difficulty
  ON public.listening_test_library(difficulty)
  WHERE is_active = true;

CREATE TRIGGER update_listening_test_library_updated_at
  BEFORE UPDATE ON public.listening_test_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
