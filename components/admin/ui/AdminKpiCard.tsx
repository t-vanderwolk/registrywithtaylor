export default function AdminKpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <article className="admin-kpi-card">
      <p className="admin-eyebrow">{label}</p>
      <p className="mt-2 admin-h2">{value}</p>
      {hint ? <p className="admin-micro mt-1">{hint}</p> : null}
    </article>
  );
}
