import Image from 'next/image';

type EditorialIllustrationScale = 'default' | 'addon' | 'card';

type EditorialIllustrationProps = {
  src: string;
  alt?: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  decorative?: boolean;
  scale?: EditorialIllustrationScale;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  unoptimized?: boolean;
};

const wrapperClassMap = {
  default:
    'min-h-[7rem] before:h-[6.5rem] before:w-[9.75rem] md:min-h-[7.5rem] md:before:h-[7rem] md:before:w-[10.75rem]',
  addon:
    'min-h-[7.5rem] before:h-[6.75rem] before:w-[10.25rem] md:min-h-[8rem] md:before:h-[7.25rem] md:before:w-[11.5rem]',
  card: 'min-h-[8rem] before:h-[7rem] before:w-[10.75rem] md:min-h-[8.5rem] md:before:h-[7.75rem] md:before:w-[12rem]',
} as const;

const mediaClassMap = {
  default: 'h-[4.25rem] max-w-[8.75rem] md:h-[5rem] md:max-w-[9.75rem]',
  addon: 'h-[4.5rem] max-w-[9.25rem] md:h-[5.5rem] md:max-w-[10.25rem]',
  card: 'h-[4.75rem] max-w-[9.75rem] md:h-[5.625rem] md:max-w-[10.5rem]',
} as const;

export default function EditorialIllustration({
  src,
  alt = '',
  sizes,
  className = '',
  imageClassName = '',
  decorative = alt.trim().length === 0,
  scale = 'default',
  loading = 'lazy',
  priority = false,
  unoptimized,
}: EditorialIllustrationProps) {
  return (
    <div
      className={[
        'editorial-illustration group relative isolate flex w-full items-center justify-center opacity-[0.78]',
        "before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-[1.4rem]",
        'before:bg-[linear-gradient(135deg,rgba(232,214,216,0.35),rgba(255,255,255,0.6))]',
        'before:shadow-[0_6px_18px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.72)]',
        "after:content-[''] after:absolute after:left-1/2 after:top-1/2 after:-z-10 after:h-[68%] after:w-[72%] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full",
        'after:bg-[radial-gradient(circle,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0)_76%)] after:blur-xl',
        wrapperClassMap[scale],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['editorial-illustration__media relative w-full', mediaClassMap[scale]].join(' ')}>
        <Image
          src={src}
          alt={decorative ? '' : alt}
          aria-hidden={decorative || undefined}
          role={decorative ? 'presentation' : undefined}
          fill
          sizes={sizes}
          loading={priority ? undefined : loading}
          priority={priority}
          unoptimized={unoptimized}
          className={[
            'editorial-illustration__image object-contain opacity-[0.74] saturate-[0.85] contrast-[0.95]',
            'drop-shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition duration-300 ease-out',
            'scale-[0.95] group-hover:-translate-y-[3px] group-hover:scale-[0.97] md:opacity-[0.84]',
            imageClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
    </div>
  );
}
