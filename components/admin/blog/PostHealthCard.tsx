import AdminSurface from '@/components/admin/ui/AdminSurface';

const h2Pattern = /^##\s+/gm;
const internalLinkPattern = /\[[^\]]+\]\((?:https?:\/\/[^)\s]+)?\/blog\/[^)\s]+\)/gi;

function countMatches(value: string, pattern: RegExp) {
  const matches = value.match(pattern);
  return matches ? matches.length : 0;
}

export default function PostHealthCard({
  body,
  focusKeyword,
  seoTitle,
  seoDescription,
  featuredImageUrl,
}: {
  body: string;
  focusKeyword?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featuredImageUrl?: string | null;
}) {
  const h2Count = countMatches(body, h2Pattern);
  const internalLinkCount = countMatches(body, internalLinkPattern);
  const checks = [
    { label: 'Focus keyword set', passed: Boolean(focusKeyword?.trim()) },
    { label: 'SEO title set', passed: Boolean(seoTitle?.trim()) },
    { label: 'Meta description set', passed: Boolean(seoDescription?.trim()) },
    { label: '2+ H2 headings', passed: h2Count >= 2, detail: `${h2Count} found` },
    { label: 'Featured image added', passed: Boolean(featuredImageUrl) },
    { label: '2+ internal links', passed: internalLinkCount >= 2, detail: `${internalLinkCount} found` },
  ];
  const passedCount = checks.filter((check) => check.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Post Health</p>
        <h2 className="admin-h2">SEO readiness</h2>
        <p className="admin-body">Guidance only. This score does not block publish.</p>
      </div>

      <div className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="admin-micro">Score</p>
            <p className="font-serif text-4xl tracking-[-0.03em] text-admin">{score}</p>
          </div>
          <span className={`admin-chip ${score >= 84 ? 'admin-chip--published' : score >= 50 ? 'admin-chip--ready' : 'admin-chip--draft'}`}>
            {score >= 84 ? 'Healthy' : score >= 50 ? 'Needs polish' : 'Needs work'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center justify-between gap-3 rounded-[20px] border px-4 py-3 ${
              check.passed
                ? 'border-[rgba(47,106,67,0.16)] bg-[rgba(47,106,67,0.05)]'
                : 'border-[var(--admin-color-border)] bg-white'
            }`}
          >
            <div className="admin-stack gap-1">
              <p className="text-sm font-medium text-admin">{check.label}</p>
              {check.detail ? <p className="admin-micro">{check.detail}</p> : null}
            </div>
            <span className={`admin-chip ${check.passed ? 'admin-chip--published' : 'admin-chip--draft'}`}>
              {check.passed ? 'Done' : 'Open'}
            </span>
          </div>
        ))}
      </div>
    </AdminSurface>
  );
}
