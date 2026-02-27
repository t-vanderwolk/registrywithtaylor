type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogPayload = Record<string, unknown>;

function emit(level: LogLevel, event: string, payload: LogPayload = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...payload,
  };

  const line = JSON.stringify(entry);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  if (level === 'debug') {
    console.debug(line);
    return;
  }

  console.info(line);
}

export const logger = {
  debug: (event: string, payload?: LogPayload) => emit('debug', event, payload),
  info: (event: string, payload?: LogPayload) => emit('info', event, payload),
  warn: (event: string, payload?: LogPayload) => emit('warn', event, payload),
  error: (event: string, payload?: LogPayload) => emit('error', event, payload),
};
