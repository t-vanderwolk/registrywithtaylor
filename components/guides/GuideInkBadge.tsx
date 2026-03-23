export default function GuideInkBadge({
  label,
  size = 'default',
  className = '',
}: {
  label: string;
  size?: 'default' | 'annotation';
  className?: string;
}) {
  const isAnnotation = size === 'annotation';

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full text-center leading-none text-[#D986A2] ${isAnnotation ? 'h-[5.7rem] min-w-[5.7rem] px-4 text-[1.08rem] sm:h-[7.1rem] sm:min-w-[7.1rem] sm:px-5 sm:text-[1.28rem]' : 'h-[4.35rem] min-w-[4.35rem] px-3 text-[0.98rem] sm:h-[5.15rem] sm:min-w-[5.15rem] sm:px-4 sm:text-[1.06rem]'} ${className}`.trim()}
      style={{ fontFamily: '"Caveat", cursive' }}
    >
      <span className="absolute inset-[2%] rounded-full bg-[radial-gradient(circle,rgba(255,228,238,0.9)_0%,rgba(255,228,238,0.38)_64%,rgba(255,228,238,0)_84%)]" />
      <span className={`absolute rounded-full border-[2.5px] border-[#E38AA7]/82 ${isAnnotation ? 'inset-[1%]' : 'inset-[2%]'} rotate-[-9deg]`} />
      <span className={`absolute rounded-full border-2 border-[#E9A1B7]/68 ${isAnnotation ? 'inset-[7%]' : 'inset-[8%]'} rotate-[7deg]`} />
      <span className={`absolute rounded-full border border-[#D986A2]/54 ${isAnnotation ? 'inset-[11%]' : 'inset-[13%]'} rotate-[2deg]`} />
      <span className={`relative max-w-[3.9rem] sm:max-w-[4.8rem] ${isAnnotation ? 'font-medium leading-[1.02]' : 'leading-[1.02]'}`}>
        {label}
      </span>
    </span>
  );
}
