/**
 * Rate Limiting Utilities
 * Prevents API abuse by limiting requests per user per endpoint
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Rate limit configurations per endpoint
export const RATE_LIMITS = {
  'ai-analyze': { maxRequests: 20, windowMinutes: 60 },
  'generate-reading': { maxRequests: 10, windowMinutes: 60 },
  'ai-chatbot': { maxRequests: 50, windowMinutes: 60 },
  'send-verification-email': { maxRequests: 5, windowMinutes: 60 },
} as const;

export type RateLimitEndpoint = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

/**
 * Checks if user has exceeded rate limit for endpoint
 * Uses database-backed rate limiting with check_rate_limit RPC
 */
export async function checkRateLimit(
  userId: string,
  endpoint: RateLimitEndpoint
): Promise<RateLimitResult> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials for rate limiting');
      // Fail open - allow request if rate limiting system is unavailable
      return { allowed: true, remaining: 999 };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const config = RATE_LIMITS[endpoint];

    // Call RPC function to check and increment rate limit
    const { data, error } = await supabase.rpc('check_rate_limit', {
      _user_id: userId,
      _endpoint: endpoint,
      _max_requests: config.maxRequests,
      _window_minutes: config.windowMinutes
    });

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if check fails
      return { allowed: true, remaining: 999 };
    }

    return {
      allowed: data.allowed,
      remaining: data.remaining,
      retryAfter: data.retry_after
    };
  } catch (error) {
    console.error('Rate limit exception:', error);
    // Fail open - allow request if exception occurs
    return { allowed: true, remaining: 999 };
  }
}

/**
 * Gets rate limit info for display (without incrementing)
 */
export async function getRateLimitInfo(
  userId: string,
  endpoint: RateLimitEndpoint
): Promise<{ limit: number; windowMinutes: number }> {
  const config = RATE_LIMITS[endpoint];
  return {
    limit: config.maxRequests,
    windowMinutes: config.windowMinutes
  };
}
