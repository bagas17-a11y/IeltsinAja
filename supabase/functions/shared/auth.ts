/**
 * Shared Authentication Utilities
 * Provides user verification and admin permission checks
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuthResult {
  success: boolean;
  userId?: string;
  error?: string;
}

/**
 * Verifies user authentication from request
 * Returns userId if valid, error message if not
 */
export async function verifyUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return { success: false, error: 'Missing authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Server configuration error' };
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { success: false, error: 'Invalid or expired token' };
  }

  return { success: true, userId: user.id };
}

/**
 * Verifies user has admin role
 * Returns userId if admin, error message if not
 */
export async function verifyAdmin(req: Request): Promise<AuthResult> {
  // First verify user authentication
  const userCheck = await verifyUser(req);
  if (!userCheck.success) {
    return userCheck;
  }

  const authHeader = req.headers.get('Authorization')!;
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Server configuration error' };
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    { global: { headers: { Authorization: authHeader } } }
  );

  // Check if user has admin role using RPC
  const { data: hasAdminRole, error } = await supabase
    .rpc('has_role', {
      _user_id: userCheck.userId!,
      _role: 'admin'
    });

  if (error) {
    console.error('Error checking admin role:', error);
    return { success: false, error: 'Failed to verify admin permissions' };
  }

  if (!hasAdminRole) {
    return { success: false, error: 'Admin role required' };
  }

  return { success: true, userId: userCheck.userId };
}

/**
 * Extracts user ID from verified request
 * Use after calling verifyUser() or verifyAdmin()
 */
export function getUserIdFromRequest(authResult: AuthResult): string | null {
  return authResult.success ? authResult.userId || null : null;
}
