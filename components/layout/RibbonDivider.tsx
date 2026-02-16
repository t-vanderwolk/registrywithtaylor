import Image from "next/image";

export default function RibbonDivider() {
  return (
    <div className="relative w-full overflow-visible pointer-events-none bg-transparent">
      <div
        className="absolute z-10 bg-transparent"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          minWidth: '100vw',
          maxWidth: 'none',
          pointerEvents: 'none',
          height: '110px',
          background: 'transparent',
        }}
      >
        <Image
          src="/assets/dividers/ribbon-divider.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          className="object-fill bg-transparent"
        />
        <div className="absolute inset-0 blur-[3px] opacity-30 pointer-events-none bg-transparent" />
      </div>

      <div className="h-[100px] bg-transparent" />
    </div>
  );
}
