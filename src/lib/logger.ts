// Logger structuré — compatible Sentry + Vercel logs
type Level = 'info' | 'warn' | 'error' | 'debug'
type LogContext = Record<string, unknown>

function log(level: Level, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    app: 'myoffmode',
    env: process.env.NODE_ENV,
    ...context,
  }

  if (level === 'error') {
    console.error(JSON.stringify(entry))
    // Sentry capture si configuré
    if (typeof window === 'undefined' && process.env.SENTRY_DSN) {
      try {
        const Sentry = require('@sentry/nextjs')
        Sentry.captureMessage(message, { level: 'error', extra: context })
      } catch {}
    }
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
  debug: (msg: string, ctx?: LogContext) => {
    if (process.env.NODE_ENV === 'development') log('debug', msg, ctx)
  },
  // Events métier
  event: (name: string, userId?: string, ctx?: LogContext) =>
    log('info', `[EVENT] ${name}`, { userId, ...ctx }),
}
