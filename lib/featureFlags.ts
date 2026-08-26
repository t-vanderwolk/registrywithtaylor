/**
 * Central feature flags.
 *
 * Academy is temporarily disabled for the simplified launch phase. All Academy
 * code, routes, database tables, content, enrollment, progress, and analytics
 * history are preserved — only the public + admin surfaces are hidden. Re-enable
 * later by setting the env vars; no code changes required.
 *
 *   NEXT_PUBLIC_ACADEMY_ENABLED=true   → show Academy publicly (nav, /learn, /academy, previews)
 *   ACADEMY_ADMIN_ENABLED=true         → show Academy admin surfaces + analytics widgets
 *
 * Both default to DISABLED — anything other than the exact string "true" is off.
 * NEXT_PUBLIC_ACADEMY_ENABLED is inlined at build time, so changing it requires a
 * rebuild (Heroku rebuilds on deploy).
 */

/** Public-facing Academy visibility. Safe to read in client components. */
export const ACADEMY_ENABLED = process.env.NEXT_PUBLIC_ACADEMY_ENABLED === 'true';

/** Public-facing Academy visibility (function form for server code). */
export function isAcademyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ACADEMY_ENABLED === 'true';
}

/** Admin Academy surfaces + analytics widgets. Server-only env var. */
export function isAcademyAdminEnabled(): boolean {
  return process.env.ACADEMY_ADMIN_ENABLED === 'true';
}

// ─── #BabylistItForward Matchmaker ────────────────────────────────────────────
//
// Rollout is a server-read tri-state so PRIVATE_BETA → PUBLIC never requires a
// rebuild (unlike NEXT_PUBLIC_* vars, which are inlined at build time):
//
//   MATCHMAKER_MODE=off           → feature fully dark (default)
//   MATCHMAKER_MODE=private_beta  → admin + invited/approved participants only;
//                                   no site-nav exposure, public routes 404
//   MATCHMAKER_MODE=public        → publicly browsable
//
// NEXT_PUBLIC_MATCHMAKER_ENABLED gates NAV VISIBILITY ONLY (build-time inlined).
// It must never be the thing that protects data — every Matchmaker page, API
// route, and Server Action checks getMatchmakerMode() server-side per request.
// Contract: docs/BABYLIST-IT-FORWARD-MATCHMAKER.md (A10, Part B #2).

export type MatchmakerMode = 'off' | 'private_beta' | 'public';

/** Server-side rollout mode. Anything unrecognized is OFF. */
export function getMatchmakerMode(): MatchmakerMode {
  const raw = process.env.MATCHMAKER_MODE?.trim().toLowerCase();
  if (raw === 'public') return 'public';
  if (raw === 'private_beta') return 'private_beta';
  return 'off';
}

/** True in private_beta or public — "does the feature exist at all right now". */
export function isMatchmakerEnabled(): boolean {
  return getMatchmakerMode() !== 'off';
}

/** True only when the directory is publicly browsable. */
export function isMatchmakerPublic(): boolean {
  return getMatchmakerMode() === 'public';
}

/**
 * Client-safe NAV visibility only (inlined at build; requires rebuild to change).
 * Never use this to gate data or routes — that is getMatchmakerMode()'s job.
 */
export const MATCHMAKER_NAV_ENABLED = process.env.NEXT_PUBLIC_MATCHMAKER_ENABLED === 'true';
