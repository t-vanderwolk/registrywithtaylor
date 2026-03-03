export default function PostSeoPanel() {
  return (
    <div className="admin-stack gap-3 rounded-[24px] border border-dashed border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.015)] px-5 py-6">
      <div className="flex flex-wrap items-center gap-2">
        <p className="admin-label">SEO Controls</p>
        <span className="admin-chip">Phase 2</span>
      </div>
      <p className="text-sm text-admin">
        Meta title, description, canonical overrides, and index controls land after the schema expands.
      </p>
      <p className="admin-micro">
        Phase 1 keeps public metadata working exactly as it does now, derived from the published article content.
      </p>
    </div>
  );
}
