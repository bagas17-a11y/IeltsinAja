-- Fix admin_delete_user: insert the audit log BEFORE deleting the user.
-- The previous version inserted admin_logs AFTER deleting from auth.users,
-- which violated the FK constraint because target_user_id no longer existed.

CREATE OR REPLACE FUNCTION public.admin_delete_user(
  target_user_id UUID,
  admin_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_email TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = admin_id AND role = 'admin'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Only admins can delete users', 'code', 'FORBIDDEN');
  END IF;

  IF target_user_id = admin_id THEN
    RETURN json_build_object('success', false, 'error', 'You cannot delete your own account', 'code', 'SELF_DELETE');
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = target_user_id;

  IF v_email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found', 'code', 'NOT_FOUND');
  END IF;

  -- Log BEFORE deleting so the FK constraint is satisfied
  INSERT INTO public.admin_logs (admin_id, target_user_id, action_type, status, details)
  VALUES (
    admin_id,
    target_user_id,
    'delete_user',
    'success',
    jsonb_build_object('deleted_email', v_email)
  );

  -- Now delete the user; ON DELETE SET NULL on admin_logs.target_user_id nullifies the log entry
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN json_build_object('success', true, 'deleted_email', v_email);

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'code', 'DB_ERROR'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID, UUID) TO authenticated;
