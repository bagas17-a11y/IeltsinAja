/**
 * Structured Logging Utility
 * Provides consistent, machine-parseable logging across all functions
 */

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  requestId?: string;
  userId?: string;
  endpoint?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId: string;
  context?: LogContext;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  duration?: number;
}

/**
 * Structured Logger Class
 * Creates consistent log entries with context
 */
export class Logger {
  private requestId: string;
  private context: LogContext;
  private startTime: number;

  constructor(req?: Request, additionalContext?: LogContext) {
    this.requestId = req?.headers.get('x-request-id') || generateRequestId();
    this.startTime = Date.now();
    this.context = {
      requestId: this.requestId,
      ...additionalContext
    };
  }

  /**
   * Add context to all subsequent logs
   */
  setContext(key: string, value: unknown): void {
    this.context[key] = value;
  }

  /**
   * Set user ID for all subsequent logs
   */
  setUserId(userId: string): void {
    this.context.userId = userId;
  }

  /**
   * Set endpoint name for all subsequent logs
   */
  setEndpoint(endpoint: string): void {
    this.context.endpoint = endpoint;
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('DEBUG', message, meta);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: Record<string, unknown>): void {
    this.log('INFO', message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('WARN', message, meta);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const errorInfo = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    } : undefined;

    const entry: LogEntry = {
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      context: { ...this.context, ...meta },
      error: errorInfo
    };

    console.error(JSON.stringify(entry));
  }

  /**
   * Log request start
   */
  logRequest(method: string, path: string, meta?: Record<string, unknown>): void {
    this.info(`${method} ${path}`, {
      method,
      path,
      ...meta
    });
  }

  /**
   * Log request completion
   */
  logResponse(status: number, meta?: Record<string, unknown>): void {
    const duration = Date.now() - this.startTime;
    this.info(`Response ${status}`, {
      status,
      duration,
      ...meta
    });
  }

  /**
   * Log function execution time
   */
  logDuration(operation: string, durationMs: number, meta?: Record<string, unknown>): void {
    this.info(`${operation} completed`, {
      operation,
      duration: durationMs,
      ...meta
    });
  }

  /**
   * Create a timer for measuring operation duration
   */
  startTimer(operation: string): () => void {
    const start = Date.now();
    return () => {
      this.logDuration(operation, Date.now() - start);
    };
  }

  /**
   * Core logging function
   */
  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      context: { ...this.context, ...meta },
      duration: Date.now() - this.startTime
    };

    // Use appropriate console method
    const logFn = level === 'ERROR' ? console.error :
                  level === 'WARN' ? console.warn :
                  level === 'DEBUG' ? console.debug :
                  console.log;

    logFn(JSON.stringify(entry));
  }

  /**
   * Get current request ID
   */
  getRequestId(): string {
    return this.requestId;
  }

  /**
   * Get elapsed time since logger creation
   */
  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * Create a logger instance from request
 */
export function createLogger(req?: Request, context?: LogContext): Logger {
  return new Logger(req, context);
}

/**
 * Log unhandled errors
 */
export function logUnhandledError(error: unknown, context?: LogContext): void {
  const entry: LogEntry = {
    level: 'ERROR',
    message: 'Unhandled error',
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
    context,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : {
      message: String(error)
    }
  };

  console.error(JSON.stringify(entry));
}
