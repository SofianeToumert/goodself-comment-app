/**
 * Configurable logging service with structured output.
 * Supports multiple log levels and custom transports.
 * @module services/logger
 */

/**
 * Available log severity levels.
 * - debug: Detailed debugging information
 * - info: General information about application flow
 * - warn: Warning messages for potentially problematic situations
 * - error: Error messages for failures and exceptions
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Structure of a log entry passed to transports.
 */
interface LogEntry {
  /** Severity level of the log */
  level: LogLevel;
  /** Human-readable log message */
  message: string;
  /** ISO 8601 timestamp of when the log was created */
  timestamp: string;
  /** Optional structured context data */
  context?: Record<string, unknown>;
  /** Optional error object for error logs */
  error?: Error;
}

/**
 * Function signature for log transports.
 * Transports receive log entries and handle output (console, file, network, etc.).
 */
type LogTransport = (entry: LogEntry) => void;

/**
 * Default transport that outputs to the browser console.
 * Formats entries with level, timestamp, message, and optional context.
 */
const defaultTransport: LogTransport = (entry) => {
  const prefix = `[${entry.level.toUpperCase()}] [${entry.timestamp}]`;
  const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';

  switch (entry.level) {
    case 'debug':
      console.debug(`${prefix} ${entry.message}${contextStr}`);
      break;
    case 'info':
      console.info(`${prefix} ${entry.message}${contextStr}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${entry.message}${contextStr}`);
      break;
    case 'error':
      console.error(`${prefix} ${entry.message}${contextStr}`, entry.error);
      break;
  }
};

/** Whether the app is running in development mode */
const isDevelopment = import.meta.env?.DEV ?? true;

/** Current active transport */
let transport: LogTransport = defaultTransport;

/**
 * Creates a structured log entry with timestamp.
 *
 * @param level - The log severity level
 * @param message - The log message
 * @param context - Optional structured context data
 * @param error - Optional error object
 * @returns A complete LogEntry object
 */
const createLogEntry = (
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  context,
  error,
});

/**
 * Determines if a log should be output based on level and environment.
 * In production, only warn and error logs are shown.
 *
 * @param level - The log level to check
 * @returns Whether the log should be output
 */
const shouldLog = (level: LogLevel): boolean => {
  if (level === 'error' || level === 'warn') return true;
  return isDevelopment;
};

/**
 * Logger instance with methods for each log level.
 * Automatically filters logs based on environment.
 *
 * @example
 * ```ts
 * // Basic logging
 * logger.debug('Processing comment', { commentId: '123' });
 * logger.info('User logged in');
 * logger.warn('Rate limit approaching', { remaining: 10 });
 * logger.error('Failed to save', error, { commentId: '123' });
 *
 * // Custom transport
 * logger.setTransport((entry) => {
 *   fetch('/api/logs', {
 *     method: 'POST',
 *     body: JSON.stringify(entry),
 *   });
 * });
 * ```
 */
export const logger = {
  /**
   * Logs a debug-level message. Only shown in development.
   *
   * @param message - The log message
   * @param context - Optional structured context data
   */
  debug: (message: string, context?: Record<string, unknown>): void => {
    if (shouldLog('debug')) {
      transport(createLogEntry('debug', message, context));
    }
  },

  /**
   * Logs an info-level message. Only shown in development.
   *
   * @param message - The log message
   * @param context - Optional structured context data
   */
  info: (message: string, context?: Record<string, unknown>): void => {
    if (shouldLog('info')) {
      transport(createLogEntry('info', message, context));
    }
  },

  /**
   * Logs a warning-level message. Always shown.
   *
   * @param message - The log message
   * @param context - Optional structured context data
   */
  warn: (message: string, context?: Record<string, unknown>): void => {
    if (shouldLog('warn')) {
      transport(createLogEntry('warn', message, context));
    }
  },

  /**
   * Logs an error-level message. Always shown.
   *
   * @param message - The log message
   * @param error - Optional error object
   * @param context - Optional structured context data
   */
  error: (
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void => {
    if (shouldLog('error')) {
      transport(createLogEntry('error', message, context, error));
    }
  },

  /**
   * Replaces the current transport with a custom implementation.
   * Useful for testing or remote logging.
   *
   * @param newTransport - The transport function to use
   */
  setTransport: (newTransport: LogTransport): void => {
    transport = newTransport;
  },
};

export type { LogLevel, LogEntry, LogTransport };
