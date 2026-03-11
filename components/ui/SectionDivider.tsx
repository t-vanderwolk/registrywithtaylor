export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={['mb-5 flex items-center', className].filter(Boolean).join(' ')}>
      <div className="h-[2px] w-16 rounded-full bg-rose-300" aria-hidden="true" />
    </div>
  );
}
