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
