/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks by sanitizing user input
 */

/**
 * Sanitizes HTML to prevent XSS attacks
 * Escapes all HTML special characters
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes text by removing control characters
 * Keeps printable characters and common whitespace
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove control characters except newline, tab, carriage return
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Sanitizes email address
 * Validates format and removes dangerous characters
 */
export function sanitizeEmail(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove whitespace and convert to lowercase
  const cleaned = input.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    return '';
  }

  return cleaned;
}

/**
 * Sanitizes UUID
 * Validates format and returns only valid UUIDs
 */
export function sanitizeUuid(input: string): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cleaned = input.trim().toLowerCase();

  return uuidRegex.test(cleaned) ? cleaned : null;
}

/**
 * Sanitizes URL
 * Validates format and ensures safe protocols
 */
export function sanitizeUrl(input: string): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  try {
    const url = new URL(input.trim());

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitizes integer input
 * Ensures value is a valid integer within optional bounds
 */
export function sanitizeInteger(
  input: unknown,
  min?: number,
  max?: number
): number | null {
  const parsed = typeof input === 'string' ? parseInt(input, 10) : Number(input);

  if (isNaN(parsed) || !isFinite(parsed)) {
    return null;
  }

  if (min !== undefined && parsed < min) {
    return null;
  }

  if (max !== undefined && parsed > max) {
    return null;
  }

  return parsed;
}

/**
 * Sanitizes filename
 * Removes path traversal attempts and dangerous characters
 */
export function sanitizeFilename(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove path traversal attempts
  let cleaned = input.replace(/\.\./g, '');

  // Remove path separators
  cleaned = cleaned.replace(/[/\\]/g, '');

  // Remove null bytes
  cleaned = cleaned.replace(/\x00/g, '');

  // Keep only safe characters (alphanumeric, dash, underscore, dot)
  cleaned = cleaned.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit length
  if (cleaned.length > 255) {
    cleaned = cleaned.substring(0, 255);
  }

  return cleaned;
}

/**
 * Sanitizes object by sanitizing all string values
 * Useful for sanitizing entire request bodies
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  sanitizer: (value: string) => string = sanitizeText
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizer(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        typeof item === 'string' ? sanitizer(item) : item
      );
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value as Record<string, unknown>, sanitizer);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
