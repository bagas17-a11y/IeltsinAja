/**
 * Shared Error Handling Utilities
 * Provides consistent error responses across all edge functions
 */

// ==============================================================================
// Error Types
// ==============================================================================

export const ErrorCodes = {
  // Client Errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Server Errors (5xx)
  AI_ERROR: 'AI_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ==============================================================================
// Response Types
// ==============================================================================

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ==============================================================================
// Response Builders
// ==============================================================================

/**
 * Creates a successful Response object
 */
export function successResponse<T>(
  data: T,
  status = 200,
  additionalHeaders: HeadersInit = {}
): Response {
  return new Response(
    JSON.stringify({ success: true, data } as SuccessResponse<T>),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    }
  );
}

/**
 * Creates an error Response object
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  details?: unknown,
  additionalHeaders: HeadersInit = {}
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: { code, message, details }
    } as ErrorResponse),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    }
  );
}

// ==============================================================================
// Common Error Responses
// ==============================================================================

/**
 * 400 Bad Request - Validation Error
 */
export function validationError(
  message: string,
  details?: unknown,
  headers: HeadersInit = {}
): Response {
  return errorResponse(
    ErrorCodes.VALIDATION_ERROR,
    message,
    400,
    details,
    headers
  );
}

/**
 * 401 Unauthorized - Missing or invalid authentication
 */
export function unauthorizedError(
  message = 'Authentication required',
  headers: HeadersInit = {}
): Response {
  return errorResponse(
    ErrorCodes.UNAUTHORIZED,
    message,
    401,
    undefined,
    headers
  );
}

/**
 * 403 Forbidden - Insufficient permissions
 */
export function forbiddenError(
  message = 'Insufficient permissions',
  headers: HeadersInit = {}
): Response {
  return errorResponse(
    ErrorCodes.FORBIDDEN,
    message,
    403,
    undefined,
    headers
  );
}

/**
 * 404 Not Found
 */
export function notFoundError(
  message = 'Resource not found',
  headers: HeadersInit = {}
): Response {
  return errorResponse(
    ErrorCodes.NOT_FOUND,
    message,
    404,
    undefined,
    headers
  );
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export function rateLimitError(
  message = 'Rate limit exceeded. Please try again later.',
  retryAfter?: number,
  headers: HeadersInit = {}
): Response {
  const allHeaders = {
    ...headers,
    ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {})
  };

  return errorResponse(
    ErrorCodes.RATE_LIMIT_EXCEEDED,
    message,
    429,
    retryAfter ? { retryAfter } : undefined,
    allHeaders
  );
}

/**
 * 500 Internal Server Error
 */
export function internalError(
  message = 'Internal server error',
  details?: unknown,
  headers: HeadersInit = {}
): Response {
  console.error('Internal error:', message, details);
  return errorResponse(
    ErrorCodes.INTERNAL_ERROR,
    message,
    500,
    details,
    headers
  );
}

/**
 * 502 Bad Gateway - AI Service Error
 */
export function aiServiceError(
  message = 'AI service error',
  details?: unknown,
  headers: HeadersInit = {}
): Response {
  console.error('AI service error:', message, details);
  return errorResponse(
    ErrorCodes.AI_ERROR,
    message,
    502,
    details,
    headers
  );
}

/**
 * 503 Service Unavailable
 */
export function serviceUnavailableError(
  message = 'Service temporarily unavailable',
  retryAfter?: number,
  headers: HeadersInit = {}
): Response {
  const allHeaders = {
    ...headers,
    ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {})
  };

  return errorResponse(
    ErrorCodes.SERVICE_UNAVAILABLE,
    message,
    503,
    retryAfter ? { retryAfter } : undefined,
    allHeaders
  );
}

/**
 * Database Error Handler
 */
export function databaseError(
  error: unknown,
  operation: string,
  headers: HeadersInit = {}
): Response {
  console.error(`Database error during ${operation}:`, error);

  const errorMessage = error instanceof Error ? error.message : 'Unknown database error';

  return errorResponse(
    ErrorCodes.DATABASE_ERROR,
    `Database operation failed: ${operation}`,
    500,
    { originalError: errorMessage },
    headers
  );
}

// ==============================================================================
// CORS Headers
// ==============================================================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
