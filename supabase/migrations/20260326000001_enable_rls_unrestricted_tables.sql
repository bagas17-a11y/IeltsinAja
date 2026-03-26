-- ============================================================
-- Enable RLS on tables that were left UNRESTRICTED
-- ============================================================

-- ------------------------------------------------------------
-- rate_limits
-- Edge functions access this via service role (bypasses RLS).
-- Direct user access should be blocked.
-- ------------------------------------------------------------
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only read their own rate limit records (for UI display if needed)
CREATE POLICY "Users can view their own rate limits"
  ON public.rate_limits FOR SELECT
  USING (auth.uid() = user_id);

-- No direct INSERT/UPDATE/DELETE from clients — edge functions use service role
-- (service role key bypasses RLS entirely, so no policy needed for service role)

-- ------------------------------------------------------------
-- reading_passages_cache
-- Edge functions write via service role.
-- No user-facing direct access required.
-- ------------------------------------------------------------
ALTER TABLE public.reading_passages_cache ENABLE ROW LEVEL SECURITY;

-- Admins can manage the cache directly (for housekeeping)
CREATE POLICY "Admins can manage reading cache"
  ON public.reading_passages_cache FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- No policy for regular users: edge functions use service role key to read/write
-- If a direct SELECT from client is ever needed, add a SELECT policy here.
