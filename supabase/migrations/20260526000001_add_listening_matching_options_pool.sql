-- ============================================================
-- Add options_pool to each matching question group in the
-- listening_test_library. The seed migration (000005) was
-- updated in place for fresh installs; this migration patches
-- already-deployed rows on the remote database.
--
-- Each test has one matching group, located at
--   sections[2].question_groups[0]
-- (Part 3, the first question group in that part).
-- ============================================================

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "cooling systems data",
    "B": "urban heat island effect",
    "C": "car emissions",
    "D": "green roof solutions",
    "E": "less vegetation and more concrete",
    "F": "data visualization"
  }'::jsonb,
  true
)
WHERE title = 'Everyday Encounters';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "Google Scholar",
    "B": "climate change and agriculture",
    "C": "economics and environmental studies",
    "D": "JSTOR",
    "E": "government reports",
    "F": "peer-review status"
  }'::jsonb,
  true
)
WHERE title = 'Student Life';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "excessive vibration levels",
    "B": "bearing misalignment",
    "C": "inferior material grade",
    "D": "stress at frame corners",
    "E": "ten percent cost increase",
    "F": "three-week deadline pressure"
  }'::jsonb,
  true
)
WHERE title = 'Working World';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "animal behaviour and communication",
    "B": "plant growth under different light",
    "C": "the plant project",
    "D": "around four weeks plus a week",
    "E": "red, blue, and white light",
    "F": "weekly rotating measurements"
  }'::jsonb,
  true
)
WHERE title = 'Community Matters';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "five days in the rainforest",
    "B": "insect species and ecological roles",
    "C": "heavy rain and inaccessible areas",
    "D": "laboratory analysis of samples",
    "E": "unusual ant nesting patterns",
    "F": "photographic documentation"
  }'::jsonb,
  true
)
WHERE title = 'Travel and Discovery';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "exam-related anxiety",
    "B": "insufficient sleep worsens anxiety",
    "C": "ten to fifteen minutes daily",
    "D": "a thirty-minute walk",
    "E": "starting with a meditation app",
    "F": "eating regularly and healthily"
  }'::jsonb,
  true
)
WHERE title = 'Health and Wellbeing';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "antibiotic properties",
    "B": "twenty-five milligrams per kg",
    "C": "disrupts bacterial cell walls",
    "D": "similar to penicillin",
    "E": "eighteen months (animal trials)",
    "F": "three years (human trials)"
  }'::jsonb,
  true
)
WHERE title = 'Science and Technology';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "a coastal ecosystem",
    "B": "one week",
    "C": "three new crab species",
    "D": "constant rain",
    "E": "cleaner water than expected",
    "F": "a journal submission"
  }'::jsonb,
  true
)
WHERE title = 'Environment and Nature';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "mixed-use development",
    "B": "fifty percent green space",
    "C": "adjacent to the metro station",
    "D": "solar panels",
    "E": "underground parking",
    "F": "a five-year completion target"
  }'::jsonb,
  true
)
WHERE title = 'Urban Life';

UPDATE public.listening_test_library
SET sections = jsonb_set(
  sections,
  '{2,question_groups,0,options_pool}',
  '{
    "A": "prejudice",
    "B": "self-awareness",
    "C": "pride",
    "D": "letter-writing scenes",
    "E": "rigid class hierarchies",
    "F": "witty dialogue exchanges"
  }'::jsonb,
  true
)
WHERE title = 'Knowledge and Culture';
