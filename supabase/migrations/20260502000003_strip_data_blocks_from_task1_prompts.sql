-- Remove embedded data text blocks from Task 1 question prompts.
-- Now that real PNG chart images are stored in question_image_url,
-- the raw DATA / STAGES / CHANGES blocks are redundant and should not show.

UPDATE public.ielts_library
SET question_prompt = CASE
  WHEN position(E'\n\nDATA' IN question_prompt) > 0
    THEN substring(question_prompt FROM 1 FOR position(E'\n\nDATA' IN question_prompt) - 1)
  WHEN position(E'\n\nSTAGES' IN question_prompt) > 0
    THEN substring(question_prompt FROM 1 FOR position(E'\n\nSTAGES' IN question_prompt) - 1)
  WHEN position(E'\n\nCHANGES' IN question_prompt) > 0
    THEN substring(question_prompt FROM 1 FOR position(E'\n\nCHANGES' IN question_prompt) - 1)
  ELSE question_prompt
END
WHERE task_type = 'Task 1 Academic'
  AND question_image_url IS NOT NULL;
