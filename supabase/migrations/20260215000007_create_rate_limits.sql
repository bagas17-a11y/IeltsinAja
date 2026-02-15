-- Rate Limiting System
-- Tracks API usage per user per endpoint to prevent abuse

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint
  ON rate_limits(user_id, endpoint);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window
  ON rate_limits(user_id, endpoint, window_start DESC);

-- Function to clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$;

-- RPC function to check and increment rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  _user_id UUID,
  _endpoint TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
  v_allowed BOOLEAN;
  v_remaining INTEGER;
BEGIN
  v_window_start := NOW() - (_window_minutes || ' minutes')::INTERVAL;

  -- Get current count for this user/endpoint in the time window
  SELECT COALESCE(SUM(request_count), 0)
  INTO v_current_count
  FROM rate_limits
  WHERE user_id = _user_id
    AND endpoint = _endpoint
    AND window_start >= v_window_start;

  -- Check if under limit
  v_allowed := v_current_count < _max_requests;
  v_remaining := GREATEST(0, _max_requests - v_current_count - 1);

  -- If allowed, increment counter
  IF v_allowed THEN
    -- Try to update existing record
    UPDATE rate_limits
    SET request_count = request_count + 1,
        updated_at = NOW()
    WHERE user_id = _user_id
      AND endpoint = _endpoint
      AND window_start >= v_window_start
      AND window_start = (
        SELECT MAX(window_start)
        FROM rate_limits
        WHERE user_id = _user_id
          AND endpoint = _endpoint
          AND window_start >= v_window_start
      );

    -- If no record was updated, create new one
    IF NOT FOUND THEN
      INSERT INTO rate_limits (user_id, endpoint, request_count, window_start)
      VALUES (_user_id, _endpoint, 1, NOW())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN json_build_object(
    'allowed', v_allowed,
    'remaining', v_remaining,
    'retry_after', CASE WHEN NOT v_allowed THEN _window_minutes * 60 ELSE NULL END
  );
END;
$$;

COMMENT ON TABLE rate_limits IS 'Rate limiting records per user per endpoint';
COMMENT ON FUNCTION check_rate_limit IS 'Checks if user has exceeded rate limit for endpoint';
COMMENT ON FUNCTION cleanup_old_rate_limits IS 'Removes rate limit records older than 24 hours';
