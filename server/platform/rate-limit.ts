/**
 * Counts failures per key over a fixed window (in memory: one server process
 * on forge; on Vercel, per function instance, which is enough for dev).
 */
export interface FailureLimiter {
  /** True once `max` failures happened within the window. */
  readonly isBlocked: (key: string) => boolean;
  readonly recordFailure: (key: string) => void;
  readonly reset: (key: string) => void;
}

interface Window {
  readonly startedAt: number;
  failures: number;
}

export const makeFailureLimiter = ({
  max,
  windowMs,
  now = Date.now,
}: {
  max: number;
  windowMs: number;
  now?: () => number;
}): FailureLimiter => {
  const windows = new Map<string, Window>();

  const current = (key: string): Window | undefined => {
    const window = windows.get(key);
    if (window && now() - window.startedAt >= windowMs) {
      windows.delete(key);
      return undefined;
    }
    return window;
  };

  return {
    isBlocked: (key) => (current(key)?.failures ?? 0) >= max,
    recordFailure: (key) => {
      const window = current(key);
      if (window) {
        window.failures += 1;
      } else {
        windows.set(key, { startedAt: now(), failures: 1 });
      }
    },
    reset: (key) => {
      windows.delete(key);
    },
  };
};
