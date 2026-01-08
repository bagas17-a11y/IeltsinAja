-- Drop the existing check constraint and add one that includes 'diagnostic'
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_exam_type_check;

ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_exam_type_check 
CHECK (exam_type IN ('writing', 'reading', 'speaking', 'listening', 'diagnostic'));