type Bucket = {
  tokens: number;
  lastRefillMs: number;
};

type RateLimitOptions = {
  route: string;
  ip: string;
  limit?: number;
  windowMs?: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();
const DEFAULT_LIMIT = 60;
const DEFAULT_WINDOW_MS = 60_000;
const STALE_BUCKET_MS = 5 * DEFAULT_WINDOW_MS;

function cleanupStaleBuckets(nowMs: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (nowMs - bucket.lastRefillMs > STALE_BUCKET_MS) {
      buckets.delete(key);
    }
  }
}

export function consumeRateLimit({
  route,
  ip,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
}: RateLimitOptions): RateLimitResult {
  const nowMs = Date.now();
  const key = `${route}:${ip}`;
  const refillRatePerMs = limit / windowMs;
  const bucket = buckets.get(key) ?? {
    tokens: limit,
    lastRefillMs: nowMs,
  };

  const elapsedMs = nowMs - bucket.lastRefillMs;
  const replenishedTokens = bucket.tokens + elapsedMs * refillRatePerMs;
  bucket.tokens = Math.min(limit, replenishedTokens);
  bucket.lastRefillMs = nowMs;

  let allowed = false;
  let retryAfterSeconds = 0;
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    allowed = true;
  } else {
    const msToNextToken = (1 - bucket.tokens) / refillRatePerMs;
    retryAfterSeconds = Math.max(1, Math.ceil(msToNextToken / 1000));
  }

  buckets.set(key, bucket);

  // Opportunistic cleanup to keep memory bounded for Phase 0.
  if (buckets.size > 1000) {
    cleanupStaleBuckets(nowMs);
  }

  return {
    allowed,
    remaining: Math.max(0, Math.floor(bucket.tokens)),
    retryAfterSeconds,
  };
}
