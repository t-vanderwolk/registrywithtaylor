type RibbonDividerProps = {
  className?: string;
  showGlow?: boolean;
  imageClassName?: string;
};

export default function RibbonDivider({
  className = '',
  showGlow = true,
  imageClassName = '',
}: RibbonDividerProps) {
  const wrapperClassName = [
    'relative w-full max-w-none flex justify-center pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName}>
      <div className="ribbon-divider__entrance relative w-full overflow-visible">
        {showGlow ? (
          <div className="absolute inset-x-[9%] -inset-y-2 z-0 blur-2xl opacity-24 bg-[radial-gradient(circle_at_center,rgba(216,137,160,0.28)_0%,rgba(216,137,160,0.1)_42%,transparent_72%)]" />
        ) : null}
        <img
          src="/assets/dividers/ribbon-divider.png"
          alt=""
          aria-hidden="true"
          role="presentation"
          className={[
            'relative z-10 block h-auto w-full opacity-[0.94] contrast-[1.08] saturate-[1.03] drop-shadow-[0_6px_14px_rgba(216,137,160,0.12)] drop-shadow-[0_16px_30px_rgba(137,96,107,0.14)] drop-shadow-[0_22px_40px_rgba(0,0,0,0.16)]',
            imageClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
    </div>
  );
}
