type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

type LogTransport = (entry: LogEntry) => void;

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

const isDevelopment = import.meta.env?.DEV ?? true;

let transport: LogTransport = defaultTransport;

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

const shouldLog = (level: LogLevel): boolean => {
  if (level === 'error' || level === 'warn') return true;
  return isDevelopment;
};

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void => {
    if (shouldLog('debug')) {
      transport(createLogEntry('debug', message, context));
    }
  },

  info: (message: string, context?: Record<string, unknown>): void => {
    if (shouldLog('info')) {
      transport(createLogEntry('info', message, context));
    }
  },

  warn: (message: string, context?: Record<string, unknown>): void => {
    if (shouldLog('warn')) {
      transport(createLogEntry('warn', message, context));
    }
  },

  error: (
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void => {
    if (shouldLog('error')) {
      transport(createLogEntry('error', message, context, error));
    }
  },

  setTransport: (newTransport: LogTransport): void => {
    transport = newTransport;
  },
};

export type { LogLevel, LogEntry, LogTransport };
