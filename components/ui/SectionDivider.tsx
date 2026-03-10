export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={['mb-6 flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <div className="h-px w-14 bg-[linear-gradient(90deg,var(--tmbc-rose),rgba(244,194,194,0.12))]" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-[var(--tmbc-rose)]/55" aria-hidden="true" />
      <div className="h-px w-8 bg-[linear-gradient(90deg,rgba(244,194,194,0.12),rgba(244,194,194,0))]" aria-hidden="true" />
    </div>
  );
}
