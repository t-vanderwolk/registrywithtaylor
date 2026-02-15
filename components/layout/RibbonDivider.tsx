import Image from "next/image";

export default function RibbonDivider() {
  return (
    <div className="relative w-full overflow-visible pointer-events-none">
      <div
        className="absolute z-10"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          minWidth: '100vw',
          maxWidth: 'none',
          pointerEvents: 'none',
          height: '110px',
        }}
      >
        <Image
          src="/assets/dividers/ribbon-divider.png"
          alt=""
          fill
          priority
          className="object-fill"
        />
        <div className="absolute inset-0 blur-[3px] opacity-30 pointer-events-none" />
      </div>

      <div className="h-[100px]" />
    </div>
  );
}
