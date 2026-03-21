import Image from 'next/image';

type ProductCta = {
  label: string;
};

export default function ProductPlaceholderCard({
  eyebrow,
  title,
  description,
  bestFor,
  standout,
  watchout,
  imageSrc,
  imageAlt,
  ctas,
}: {
  eyebrow: string;
  title: string;
  description: string;
  bestFor: string;
  standout?: string | null;
  watchout?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  ctas: ProductCta[];
}) {
  return (
    <section className="overflow-hidden rounded-[1.85rem] border border-[rgba(215,161,175,0.18)] bg-white/92 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
      <div className="relative h-48 bg-[linear-gradient(135deg,rgba(251,245,239,0.98),rgba(247,231,236,0.92))]">
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt || title} fill className="object-contain p-8" sizes="(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 100vw" />
        ) : null}
      </div>

      <div className="space-y-4 p-6">
        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-[#A15B72]">{eyebrow}</p>
        <div>
          <h3 className="text-xl font-medium text-[#2F2430]">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{description}</p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Best For</p>
            <p className="mt-2 text-sm leading-7 text-[#4B3641]">{bestFor}</p>
          </div>

          {standout ? (
            <div className="rounded-[1.2rem] bg-[rgba(250,244,246,0.92)] px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Standout</p>
              <p className="mt-2 text-sm leading-7 text-[#4B3641]">{standout}</p>
            </div>
          ) : null}

          {watchout ? (
            <div className="rounded-[1.2rem] bg-[rgba(248,241,243,0.84)] px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Watchout</p>
              <p className="mt-2 text-sm leading-7 text-[#4B3641]">{watchout}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {ctas.map((cta) => (
            <span
              key={cta.label}
              className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(215,161,175,0.18)] bg-[rgba(252,247,249,0.96)] px-4 py-2 font-mono text-[0.68rem] text-[#7C5663]"
            >
              {cta.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
