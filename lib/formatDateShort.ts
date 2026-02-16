export function formatDateShort(ts?: number) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
