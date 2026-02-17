/**
 * Shared Validation Utilities
 * Uses Zod for runtime type validation of edge function inputs
 */

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// ==============================================================================
// AI Analyze Schemas
// ==============================================================================

export const AIAnalyzeSchema = z.object({
  type: z.enum(['writing', 'speaking', 'reading', 'generate-model']),
  content: z.string().min(1).max(50000),
  taskType: z.string().optional(),
  isRevision: z.boolean().optional(),
  questionId: z.string().uuid().optional(),
  secretContext: z.string().max(5000).optional(),
  modelAnswer: z.string().max(5000).optional(),
  targetKeywords: z.string().max(1000).optional(),
  prompt: z.string().max(5000).optional(),
  speakingPart: z.string().optional(),
  question: z.string().max(2000).optional(),
});

export type AIAnalyzeInput = z.infer<typeof AIAnalyzeSchema>;

// ==============================================================================
// Generate Reading Schema
// ==============================================================================

export const GenerateReadingSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  topic: z.string().min(1).max(200).optional(),
});

export type GenerateReadingInput = z.infer<typeof GenerateReadingSchema>;

// ==============================================================================
// Chatbot Schema
// ==============================================================================

export const ChatbotMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(5000),
});

export const ChatbotSchema = z.object({
  messages: z.array(ChatbotMessageSchema).min(1).max(50),
  language: z.enum(['en', 'id']).default('en'),
});

export type ChatbotInput = z.infer<typeof ChatbotSchema>;

// ==============================================================================
// Send Email Schema
// ==============================================================================

export const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  userName: z.string().min(1).max(100),
  planName: z.string().min(1).max(50),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

// ==============================================================================
// Generic Validation Function
// ==============================================================================

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  error: {
    code: string;
    message: string;
    details: Array<{
      path: string[];
      message: string;
    }>;
  };
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

/**
 * Validates input data against a Zod schema
 * Returns either validated data or detailed error information
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map(e => ({
        path: e.path.map(String),
        message: e.message
      }));

      const errorMessage = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');

      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid request: ${errorMessage}`,
          details
        }
      };
    }

    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request format',
        details: []
      }
    };
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize text by removing control characters
 */
export function sanitizeText(input: string): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
