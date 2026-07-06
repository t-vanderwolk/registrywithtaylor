import crypto from 'crypto';
import type { NextRequest } from 'next/server';

/**
 * Shared view-counting hygiene for the blog + guides `track` routes.
 *
 * Why this exists: the admin dashboard's view numbers used to be a raw
 * `increment: 1` on every POST, with no bot filtering and no de-duplication.
 * That inflates the counter far above GA4 (which filters bots, drops
 * adblocked/consent-declined hits, and de-dupes within a session). These
 * helpers bring the DB counter closer to GA's methodology:
 *   1. isLikelyBot()   — skip obvious crawlers / preview bots / HTTP libraries.
 *   2. cookie de-dup    — count a given visitor once per post per window,
 *                         so refreshes and quick re-visits don't each add +1.
 *
 * De-dup uses an httpOnly cookie (serverless-safe, no extra table). It is
 * best-effort: clearing cookies or switching devices resets it, exactly like
 * GA's own client-side de-duplication.
 */

// Matches common crawlers, link-preview bots, headless browsers, monitors, and
// bare HTTP clients. Deliberately does NOT match real browser UAs (which say
// "Mozilla/5.0 ... Chrome/Safari/Firefox" without any of these tokens).
const BOT_UA_RE =
  /bot\b|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora|pinterest|whatsapp|telegram|discordbot|slackbot|bingpreview|headless|phantomjs|lighthouse|gtmetrix|pingdom|uptimerobot|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|yandex|baiduspider|python-requests|axios|node-fetch|okhttp|libwww|curl\/|wget\/|go-http|java\//i;

/** True for empty UAs and known non-human agents. */
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  const ua = (userAgent ?? '').trim();
  if (!ua) return true;
  return BOT_UA_RE.test(ua);
}

/** Best-effort client IP from proxy headers (Heroku sets x-forwarded-for). */
export function getRequestIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    if (first?.trim()) return first.trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp?.trim()) return realIp.trim();
  return null;
}

/** Stable, non-reversible visitor id from IP (+ UA) for analytics storage. */
export function visitorHashFrom(ip: string | null, userAgent: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(`${ip}|${userAgent ?? ''}`).digest('hex');
}

// ── Cookie-based per-visitor de-duplication ──────────────────────────────────

export const SEEN_COOKIE_NAME = 'tmbc_seen';
const WINDOW_MS = 6 * 60 * 60 * 1000; // 6h: kills refresh / same-session re-counts
export const SEEN_WINDOW_SECONDS = Math.floor(WINDOW_MS / 1000);
const MAX_ENTRIES = 50; // keep the cookie well under the 4KB browser limit

type SeenEntry = { k: string; t: number };

/** Short, collision-resistant-enough key for a content id (keeps cookie small). */
export function seenKey(kind: 'p' | 'g', id: string): string {
  return kind + crypto.createHash('sha1').update(id).digest('hex').slice(0, 10);
}

function parseSeen(cookieValue: string | undefined | null): SeenEntry[] {
  if (!cookieValue) return [];
  try {
    const parsed = JSON.parse(cookieValue);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is SeenEntry => !!e && typeof e.k === 'string' && typeof e.t === 'number',
    );
  } catch {
    return [];
  }
}

/** Has this visitor already been counted for `key` within the window? */
export function hasSeen(cookieValue: string | undefined | null, key: string, now = Date.now()): boolean {
  return parseSeen(cookieValue).some((e) => e.k === key && now - e.t < WINDOW_MS);
}

/** Next cookie value after recording a fresh, counted view for `key`. */
export function buildSeenCookie(cookieValue: string | undefined | null, key: string, now = Date.now()): string {
  const pruned = parseSeen(cookieValue).filter((e) => now - e.t < WINDOW_MS && e.k !== key);
  pruned.push({ k: key, t: now });
  return JSON.stringify(pruned.slice(-MAX_ENTRIES));
}
