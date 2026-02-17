-- Improve trigger error handling to surface profile creation failures
-- This replaces the silent failure with proper error reporting

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_phone_number TEXT;
  v_full_name TEXT;
BEGIN
  -- Extract metadata
  v_phone_number := NEW.raw_user_meta_data->>'phone_number';
  v_full_name := NEW.raw_user_meta_data->>'full_name';

  -- Create profile with proper error handling
  INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    phone_number,
    subscription_tier,
    is_verified
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_phone_number,
    'free',
    false
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
    updated_at = NOW();

  -- Log successful profile creation
  RAISE NOTICE 'Profile created/updated for user %', NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the actual error with details
    RAISE EXCEPTION 'Failed to create profile for user %: % (SQLSTATE: %)',
      NEW.id, SQLERRM, SQLSTATE;
    -- This will cause the entire transaction to rollback, including user creation
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT ALL ON public.profiles TO authenticated, service_role;

-- Recreate trigger to use updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Creates user profile on signup with proper error handling - will fail entire transaction if profile creation fails';
