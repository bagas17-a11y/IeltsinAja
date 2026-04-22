-- Optional metadata for real exam paper sourcing (Writing / library)
ALTER TABLE public.ielts_library
  ADD COLUMN IF NOT EXISTS source_book text,
  ADD COLUMN IF NOT EXISTS test_number text,
  ADD COLUMN IF NOT EXISTS task_part text;

COMMENT ON COLUMN public.ielts_library.source_book IS 'e.g. Cambridge IELTS 18';
COMMENT ON COLUMN public.ielts_library.test_number IS 'e.g. Test 2';
COMMENT ON COLUMN public.ielts_library.task_part IS 'e.g. Writing Task 2';
