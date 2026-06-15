import Image from 'next/image';

type LessonImageProps = {
  src: string;
  alt: string;
  caption?: string;
  /** @deprecated — no longer enforces a crop ratio; kept for call-site compat */
  aspectRatio?: '16/9' | '4/3' | '3/2';
  priority?: boolean;
};

export default function LessonImage({
  src,
  alt,
  caption,
  priority = false,
}: LessonImageProps) {
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={900}
        priority={priority}
        sizes="(min-width: 768px) 700px, 100vw"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '1.35rem',
          boxShadow: '0 12px 32px rgba(58,36,43,0.07)',
          border: '1px solid rgba(215,161,175,0.18)',
        }}
      />
      {caption && (
        <figcaption className="mt-2.5 text-center text-[0.77rem] leading-snug text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
