-- Remove "Everyday Encounters" which is identical to the static mock data.
-- The remaining 9 library tests (plus AI-generated content) provide sufficient variety.
DELETE FROM public.listening_test_library WHERE title = 'Everyday Encounters';
