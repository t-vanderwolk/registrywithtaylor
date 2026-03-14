import EmbeddedEditorialImage from '@/components/ui/EmbeddedEditorialImage';

type EditorialInsetImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  variant?: 'soft' | 'paper' | 'halo';
  align?: 'left' | 'center' | 'right';
  mode?: 'inline' | 'overlay';
  textOverlay?: boolean;
};

const inlineVariantMap = {
  soft: 'supporting',
  paper: 'supporting',
  halo: 'supporting',
} as const;

const overlayVariantMap = {
  soft: 'embedded',
  paper: 'embedded',
  halo: 'embedded',
} as const;

const inlineSurfaceClassMap = {
  soft: '',
  paper:
    'rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(249,241,234,0.88)_100%)] p-2.5 shadow-[0_12px_26px_rgba(56,39,47,0.04)]',
  halo:
    'rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(252,244,246,0.92)_100%)] shadow-[0_16px_30px_rgba(56,39,47,0.045)]',
} as const;

const overlayVeilClassMap = {
  left:
    'inset-y-[6%] left-[26%] right-[-8%] rounded-[2.2rem] bg-[linear-gradient(270deg,rgba(252,247,244,0.98)_0%,rgba(252,247,244,0.86)_22%,rgba(252,247,244,0.52)_48%,rgba(252,247,244,0)_78%)] blur-[18px]',
  center:
    'inset-y-[10%] inset-x-[18%] rounded-[999px] bg-[radial-gradient(circle,rgba(252,247,244,0.96)_0%,rgba(252,247,244,0.56)_46%,rgba(252,247,244,0)_80%)] blur-[22px]',
  right:
    'inset-y-[6%] left-[-8%] right-[26%] rounded-[2.2rem] bg-[linear-gradient(90deg,rgba(252,247,244,0.98)_0%,rgba(252,247,244,0.86)_22%,rgba(252,247,244,0.52)_48%,rgba(252,247,244,0)_78%)] blur-[18px]',
} as const;

export default function EditorialInsetImage({
  src,
  alt,
  width,
  height,
  className = '',
  variant = 'soft',
  align = 'center',
  mode = 'inline',
  textOverlay = false,
}: EditorialInsetImageProps) {
  const isOverlay = mode === 'overlay';

  return (
    <EmbeddedEditorialImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 1024px) 26vw, 100vw"
      variant={isOverlay ? overlayVariantMap[variant] : inlineVariantMap[variant]}
      align={align}
      placement={isOverlay ? 'absolute' : 'flow'}
      className={className}
      surfaceClassName={isOverlay ? '' : inlineSurfaceClassMap[variant]}
      veilClassName={isOverlay && textOverlay ? overlayVeilClassMap[align] : ''}
      imageClassName={[
        isOverlay ? 'object-contain' : 'object-cover',
        isOverlay ? 'scale-[1.01] saturate-[0.97] contrast-[0.99] brightness-[1]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
