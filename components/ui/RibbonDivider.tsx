import Image from "next/image";

export default function RibbonDivider({
  className = "",
  alt = "Decorative ribbon divider",
}: {
  className?: string;
  alt?: string;
}) {
  const containerClasses = [
    className,
    "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-hidden="true" className={containerClasses}>
      <div className="relative h-[140px] w-full sm:h-[160px] md:h-[200px]">
        <Image
          src="/assets/dividers/ribbon-divider.png"
          alt={alt}
          fill
          sizes="100vw"
          priority
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
