/**
 * JSON Parsing Utilities
 * Robust JSON extraction from AI responses that may contain markdown or extra text
 */

/**
 * Extracts JSON from text that may contain markdown code blocks or surrounding text
 * Tries multiple strategies to find and parse valid JSON
 */
export function extractJson(text: string): unknown | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Strategy 1: Direct parse (text is already clean JSON)
  try {
    return JSON.parse(text);
  } catch {
    // Continue to next strategy
  }

  // Strategy 2: Extract from markdown code block with json language specifier
  const jsonCodeBlockMatch = text.match(/```json\s*\n([\s\S]*?)\n```/);
  if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
    try {
      return JSON.parse(jsonCodeBlockMatch[1]);
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 3: Extract from any markdown code block
  const codeBlockMatch = text.match(/```\s*\n([\s\S]*?)\n```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 4: Find JSON object (find first { and last })
  const objectStart = text.indexOf('{');
  const objectEnd = text.lastIndexOf('}');
  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    try {
      return JSON.parse(text.substring(objectStart, objectEnd + 1));
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 5: Find JSON array (find first [ and last ])
  const arrayStart = text.indexOf('[');
  const arrayEnd = text.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    try {
      return JSON.parse(text.substring(arrayStart, arrayEnd + 1));
    } catch {
      // All strategies failed
    }
  }

  // All strategies failed
  console.warn('Failed to extract JSON from text:', text.substring(0, 200));
  return null;
}

/**
 * Safely stringifies JSON with error handling
 */
export function safeStringify(data: unknown, pretty = false): string {
  try {
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify JSON:', error);
    return '{}';
  }
}

/**
 * Validates that a value is a valid JSON object (not null, not array)
 */
export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

/**
 * Validates that a value is a valid JSON array
 */
export function isJsonArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Extracts and validates JSON object from text
 * Returns null if extraction fails or result is not an object
 */
export function extractJsonObject(text: string): Record<string, unknown> | null {
  const extracted = extractJson(text);
  return isJsonObject(extracted) ? extracted : null;
}

/**
 * Extracts and validates JSON array from text
 * Returns null if extraction fails or result is not an array
 */
export function extractJsonArray(text: string): unknown[] | null {
  const extracted = extractJson(text);
  return isJsonArray(extracted) ? extracted : null;
}
