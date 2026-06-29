-- ─────────────────────────────────────────────────────────────
-- Schedule subscription expiry + renewal reminders via pg_cron
-- Requires: pg_cron and pg_net extensions enabled in Supabase
-- ─────────────────────────────────────────────────────────────

-- 1. SQL function to expire pro subscriptions directly in Postgres.
--    Called by pg_cron daily at 02:00 UTC so no HTTP round-trip is needed.
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS TABLE(expired_count integer, expired_emails text[]) AS $$
DECLARE
  _ids     uuid[];
  _emails  text[];
BEGIN
  SELECT
    array_agg(user_id),
    array_agg(email)
  INTO _ids, _emails
  FROM public.profiles
  WHERE subscription_tier = 'pro'
    AND subscription_end_date IS NOT NULL
    AND subscription_end_date < NOW();

  IF _ids IS NULL THEN
    RETURN QUERY SELECT 0, ARRAY[]::text[];
    RETURN;
  END IF;

  UPDATE public.profiles
  SET subscription_tier   = 'free',
      subscription_end_date = NULL
  WHERE user_id = ANY(_ids);

  RETURN QUERY SELECT array_length(_ids, 1), _emails;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to postgres role used by cron
GRANT EXECUTE ON FUNCTION public.expire_subscriptions() TO postgres;

-- 2. Schedule expiry daily at 02:00 UTC.
--    cron.schedule is idempotent by name — safe to re-run migrations.
SELECT cron.schedule(
  'expire-subscriptions-daily',
  '0 2 * * *',
  $cron$ SELECT public.expire_subscriptions(); $cron$
);

-- 3. Schedule renewal reminder edge function daily at 09:00 UTC.
--    Uses pg_net to POST to the edge function with the cron secret from vault.
--    If vault secret 'cron_secret' is not set, the call still reaches the function
--    and the function will skip auth (CRON_SECRET env var controls that separately).
DO $$
DECLARE
  _project_url text := 'https://jryjpjkutwrieneuaoxv.supabase.co';
  _cron_secret text;
BEGIN
  -- Try to read cron_secret from vault; fall back to empty string if not configured
  BEGIN
    SELECT decrypted_secret INTO _cron_secret
    FROM vault.decrypted_secrets
    WHERE name = 'cron_secret'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    _cron_secret := '';
  END;

  PERFORM cron.schedule(
    'renewal-reminders-daily',
    '0 9 * * *',
    format(
      $q$
        SELECT net.http_post(
          url     := %L,
          headers := %L::jsonb,
          body    := '{}'::jsonb
        );
      $q$,
      _project_url || '/functions/v1/cron-renewal-reminders',
      jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || coalesce(_cron_secret, '')
      )::text
    )
  );
END $$;
