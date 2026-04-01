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
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ] : [])
];

/**
 * Gets CORS headers for a request
 * Returns appropriate headers based on origin allowlist
 */
function isOriginAllowedDynamic(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+-[a-z0-9]+-[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

export function getCorsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') || '';

  const allowedOrigin = isOriginAllowedDynamic(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

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
  return isOriginAllowedDynamic(origin);
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
