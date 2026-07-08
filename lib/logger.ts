// lib/logger.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central logger — a small, dependency-free leveled logger used across
// controllers and server actions so every log line has a consistent shape:
//   [ISO timestamp] [LEVEL] [scope] message  (+ optional meta as a 2nd arg)
// ─────────────────────────────────────────────────────────────────────────────

type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, scope: string, message: string, meta?: unknown) {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${scope}] ${message}`;
  const consoleFn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (meta !== undefined) {
    consoleFn(line, meta);
  } else {
    consoleFn(line);
  }
}

export const logger = {
  info: (scope: string, message: string, meta?: unknown) => write("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: unknown) => write("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: unknown) => write("error", scope, message, meta),
};
