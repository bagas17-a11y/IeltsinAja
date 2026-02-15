/**
 * CORS Configuration Utilities
 * Provides secure CORS handling with origin allowlist
 */

// Production and development allowed origins
const ALLOWED_ORIGINS = [
  // Production domains (update with your actual domain)
  'https://ieltsinja.com',
  'https://www.ieltsinja.com',

  // Supabase hosted frontend
  'https://jryjpjkutwrieneuaoxv.supabase.co',

  // Development (only if not in production)
  ...(Deno.env.get('ENVIRONMENT') !== 'production' ? [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ] : [])
];

/**
 * Gets CORS headers for a request
 * Returns appropriate headers based on origin allowlist
 */
export function getCorsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') || '';

  // Check if origin is in allowlist
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]; // Default to first allowed origin

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Handles CORS preflight OPTIONS requests
 */
export function handleCorsPreflightRequest(req: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(req)
  });
}

/**
 * Checks if origin is allowed
 */
export function isOriginAllowed(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Basic CORS headers (backwards compatibility)
 * Use getCorsHeaders() for origin-specific headers
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
