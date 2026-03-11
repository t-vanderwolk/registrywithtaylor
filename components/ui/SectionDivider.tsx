export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={['mb-5 flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <div className="h-[2px] w-16 rounded-full bg-rose-300" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-rose-200" aria-hidden="true" />
    </div>
  );
}
