/**
 * AI Client with Retry Logic
 * Handles Claude API calls with exponential backoff and retries
 */

import { Logger } from './logger.ts';

export interface AIRequestOptions {
  model?: string;
  maxTokens: number;
  temperature?: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AIRetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<AIRetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2
};

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(
  attempt: number,
  options: Required<AIRetryOptions>
): number {
  const delay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelayMs);
}

/**
 * Check if error is retryable
 */
function isRetryableError(status: number): boolean {
  // Retry on server errors and rate limits
  return status >= 500 || status === 429;
}

/**
 * Call Claude API with automatic retries
 */
export async function callAIWithRetry(
  requestOptions: AIRequestOptions,
  retryOptions: AIRetryOptions = {},
  logger?: Logger
): Promise<{ success: true; data: any } | { success: false; error: string; status?: number }> {
  const options = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');

  if (!apiKey) {
    return { success: false, error: 'ANTHROPIC_API_KEY not configured' };
  }

  const model = requestOptions.model || 'claude-3-5-sonnet-20241022';
  const url = 'https://api.anthropic.com/v1/messages';

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      logger?.debug(`AI request attempt ${attempt}/${options.maxRetries}`, {
        model,
        maxTokens: requestOptions.maxTokens
      });

      const requestBody = {
        model,
        max_tokens: requestOptions.maxTokens,
        temperature: requestOptions.temperature ?? 0.3,
        messages: requestOptions.messages
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Success - return response
      if (response.ok) {
        const data = await response.json();
        logger?.info('AI request successful', {
          attempt,
          model,
          status: response.status
        });
        return { success: true, data };
      }

      // Check if we should retry
      if (isRetryableError(response.status) && attempt < options.maxRetries) {
        const delay = calculateBackoffDelay(attempt, options);
        const errorText = await response.text();

        logger?.warn(`AI request failed, retrying in ${delay}ms`, {
          attempt,
          status: response.status,
          error: errorText.substring(0, 200)
        });

        await sleep(delay);
        continue; // Retry
      }

      // Non-retryable error or max retries reached
      const errorText = await response.text();
      logger?.error('AI request failed', new Error(errorText), {
        attempt,
        status: response.status,
        maxRetries: options.maxRetries
      });

      return {
        success: false,
        error: `AI request failed: ${response.status}`,
        status: response.status
      };

    } catch (error) {
      // Network error or other exception
      if (attempt < options.maxRetries) {
        const delay = calculateBackoffDelay(attempt, options);

        logger?.warn(`AI request exception, retrying in ${delay}ms`, {
          attempt,
          error: error instanceof Error ? error.message : String(error)
        });

        await sleep(delay);
        continue; // Retry
      }

      // Max retries reached
      logger?.error('AI request failed after retries', error instanceof Error ? error : new Error(String(error)));

      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI request failed'
      };
    }
  }

  // Should never reach here
  return { success: false, error: 'Unexpected error in retry logic' };
}

/**
 * Extract text from Claude API response
 */
export function extractTextFromResponse(data: any): string | null {
  return data?.content?.[0]?.text || null;
}

/**
 * Call Claude API with retries and extract text
 */
export async function callAIForText(
  requestOptions: AIRequestOptions,
  retryOptions?: AIRetryOptions,
  logger?: Logger
): Promise<{ success: true; text: string } | { success: false; error: string }> {
  const result = await callAIWithRetry(requestOptions, retryOptions, logger);

  if (!result.success) {
    return result;
  }

  const text = extractTextFromResponse(result.data);
  if (!text) {
    return { success: false, error: 'No text content in AI response' };
  }

  return { success: true, text };
}
