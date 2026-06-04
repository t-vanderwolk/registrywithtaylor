import Image from 'next/image';

type LessonImageProps = {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: '16/9' | '4/3' | '3/2';
  priority?: boolean;
};

const aspectClasses = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
};

export default function LessonImage({
  src,
  alt,
  caption,
  aspectRatio = '4/3',
  priority = false,
}: LessonImageProps) {
  return (
    <figure className="my-1">
      <div
        className={`relative w-full overflow-hidden rounded-[1.35rem] border border-[rgba(215,161,175,0.18)] shadow-[0_12px_32px_rgba(58,36,43,0.07)] ${aspectClasses[aspectRatio]}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(min-width: 896px) 800px, 100vw"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center text-[0.77rem] leading-snug text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
