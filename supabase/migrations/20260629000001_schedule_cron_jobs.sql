-- ─────────────────────────────────────────────────────────────
-- Schedule subscription expiry + renewal reminders via pg_cron
-- Requires: pg_cron and pg_net extensions enabled in Supabase
-- Cron scheduling steps are skipped gracefully if pg_cron is not enabled.
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

-- 2. Schedule cron jobs only if pg_cron extension is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'expire-subscriptions-daily',
      '0 2 * * *',
      $cron$ SELECT public.expire_subscriptions(); $cron$
    );
  END IF;
END $$;

-- 3. Schedule renewal reminder edge function daily at 09:00 UTC (pg_cron + pg_net required).
DO $$
DECLARE
  _project_url text := 'https://jryjpjkutwrieneuaoxv.supabase.co';
  _cron_secret text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    RETURN;
  END IF;

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
