-- Reading Passage Cache
-- Reduces AI generation costs by caching and reusing generated passages

CREATE TABLE IF NOT EXISTS reading_passages_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT,
  passage TEXT NOT NULL,
  questions JSONB NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_reading_cache_difficulty
  ON reading_passages_cache(difficulty);

CREATE INDEX IF NOT EXISTS idx_reading_cache_difficulty_usage
  ON reading_passages_cache(difficulty, usage_count, last_used_at);

CREATE INDEX IF NOT EXISTS idx_reading_cache_topic
  ON reading_passages_cache(topic)
  WHERE topic IS NOT NULL;

-- Function to get a cached reading passage
CREATE OR REPLACE FUNCTION get_cached_reading_passage(
  _difficulty TEXT,
  _topic TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_passage RECORD;
BEGIN
  -- Try to find a least-recently-used passage for the difficulty
  -- Prioritize passages that match the topic (if provided) and haven't been used much
  SELECT *
  INTO v_passage
  FROM reading_passages_cache
  WHERE difficulty = _difficulty
    AND (_topic IS NULL OR topic = _topic OR topic IS NULL)
  ORDER BY
    CASE WHEN topic = _topic THEN 0 ELSE 1 END, -- Prioritize topic match
    usage_count ASC, -- Prefer less-used passages
    last_used_at ASC NULLS FIRST -- Prefer never-used or oldest
  LIMIT 1;

  -- If found, update usage stats and return
  IF FOUND THEN
    UPDATE reading_passages_cache
    SET
      usage_count = usage_count + 1,
      last_used_at = NOW(),
      updated_at = NOW()
    WHERE id = v_passage.id;

    RETURN json_build_object(
      'found', true,
      'passage', v_passage.passage,
      'questions', v_passage.questions,
      'cached_id', v_passage.id
    );
  END IF;

  -- Not found
  RETURN json_build_object('found', false);
END;
$$;

-- Function to save a generated passage to cache
CREATE OR REPLACE FUNCTION save_reading_passage_to_cache(
  _difficulty TEXT,
  _topic TEXT,
  _passage TEXT,
  _questions JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Insert new cached passage
  INSERT INTO reading_passages_cache (
    difficulty,
    topic,
    passage,
    questions,
    usage_count,
    last_used_at
  )
  VALUES (
    _difficulty,
    _topic,
    _passage,
    _questions,
    1, -- Already used once (when generated)
    NOW()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Function to clean up old/overused cached passages
CREATE OR REPLACE FUNCTION cleanup_reading_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Delete passages that have been used too many times (prevent staleness)
  -- Or passages older than 90 days (keep content fresh)
  DELETE FROM reading_passages_cache
  WHERE usage_count > 50 -- Used more than 50 times
     OR created_at < NOW() - INTERVAL '90 days'; -- Older than 90 days

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$;

COMMENT ON TABLE reading_passages_cache IS 'Caches AI-generated reading passages to reduce costs';
COMMENT ON FUNCTION get_cached_reading_passage IS 'Retrieves a cached passage by difficulty and optional topic';
COMMENT ON FUNCTION save_reading_passage_to_cache IS 'Saves a newly generated passage to cache';
COMMENT ON FUNCTION cleanup_reading_cache IS 'Removes overused or old passages from cache';
