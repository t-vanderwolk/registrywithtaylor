type EmbeddedEditorialVariant = 'embedded' | 'supporting' | 'quiet' | 'cover';
type EmbeddedEditorialAlign = 'left' | 'center' | 'right';
type EmbeddedEditorialPlacement = 'flow' | 'absolute';
type EmbeddedEditorialMotion = 'none' | 'float' | 'float-reverse' | 'drift';

type SharedProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  frameClassName?: string;
  surfaceClassName?: string;
  imageClassName?: string;
  veilClassName?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  unoptimized?: boolean;
  variant?: EmbeddedEditorialVariant;
  align?: EmbeddedEditorialAlign;
  placement?: EmbeddedEditorialPlacement;
  motion?: EmbeddedEditorialMotion;
};

type FixedImageProps = SharedProps & {
  width: number;
  height: number;
  fill?: false;
  aspectClassName?: never;
};

type FillImageProps = SharedProps & {
  fill: true;
  aspectClassName: string;
  width?: never;
  height?: never;
};

type EmbeddedEditorialImageProps = FixedImageProps | FillImageProps;

export default function EmbeddedEditorialImage(props: EmbeddedEditorialImageProps) {
  const {
    src,
    alt,
    className = '',
    frameClassName = '',
    surfaceClassName = '',
    imageClassName = '',
    veilClassName = '',
    variant = 'supporting',
    align = 'center',
    placement = 'flow',
    motion = 'none',
  } = props;

  const alignmentClassMap = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  } as const;

  const flowWrapperClassMap = {
    embedded: 'w-fit max-w-[16rem] md:max-w-[19rem] lg:max-w-[23rem]',
    supporting: 'w-full max-w-[17rem] md:max-w-[21rem] lg:max-w-[24rem]',
    quiet: 'w-fit max-w-[9.5rem] md:max-w-[11.5rem] lg:max-w-[13.5rem]',
    cover: 'w-full',
  } as const;

  const motionClassMap = {
    none: '',
    float: 'editorial-float',
    'float-reverse': 'editorial-float--reverse',
    drift: 'editorial-drift',
  } as const;

  const frameClassMap = {
    embedded: 'relative overflow-visible',
    supporting: 'relative overflow-visible',
    quiet: 'relative overflow-visible',
    cover: 'group relative overflow-visible',
  } as const;

  const surfaceClassMap = {
    embedded: 'relative overflow-visible',
    supporting:
      'relative rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(249,242,237,0.92)_100%)] p-3 shadow-[0_14px_30px_rgba(56,39,47,0.04)] backdrop-blur-[0.5px]',
    quiet: 'relative overflow-visible',
    cover:
      'relative rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(249,242,237,0.92)_100%)] p-2.5 shadow-[0_12px_26px_rgba(56,39,47,0.04)]',
  } as const;

  const fillMediaClassMap = {
    embedded: 'relative overflow-hidden',
    supporting: 'relative overflow-hidden rounded-[1.45rem]',
    quiet: 'relative overflow-hidden',
    cover: 'relative overflow-hidden rounded-[1.28rem]',
  } as const;

  const auraClassMap = {
    embedded:
      'absolute inset-[-15%] -z-20 rounded-[999px] bg-[radial-gradient(circle,rgba(246,237,232,0.52)_0%,rgba(246,237,232,0.22)_44%,transparent_78%)] blur-[34px] scale-[1.04]',
    supporting:
      'absolute inset-[-14%] -z-20 rounded-[999px] bg-[radial-gradient(circle,rgba(246,237,232,0.5)_0%,rgba(246,237,232,0.2)_44%,transparent_78%)] blur-[34px] scale-[1.04]',
    quiet:
      'absolute inset-[-18%] -z-20 rounded-[999px] bg-[radial-gradient(circle,rgba(246,237,232,0.46)_0%,rgba(246,237,232,0.18)_44%,transparent_80%)] blur-[32px] scale-[1.02]',
    cover:
      'absolute inset-x-[10%] inset-y-[-7%] -z-20 rounded-[999px] bg-[radial-gradient(circle,rgba(246,237,232,0.44)_0%,rgba(246,237,232,0.16)_50%,transparent_82%)] blur-[24px]',
  } as const;

  const washClassMap = {
    embedded:
      'absolute inset-x-[18%] inset-y-[18%] -z-10 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0)_74%)] blur-2xl',
    supporting:
      'absolute inset-x-[16%] inset-y-[16%] -z-10 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0)_76%)] blur-2xl',
    quiet:
      'absolute inset-[20%] -z-10 rounded-[999px] bg-[radial-gradient(circle,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0)_72%)] blur-2xl',
    cover:
      'absolute inset-x-[18%] inset-y-[14%] -z-10 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_76%)] blur-2xl',
  } as const;

  const absoluteImageClassMap = {
    embedded:
      'scale-[1.01] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_12px_24px_rgba(54,38,45,0.045)] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_92%)]',
    supporting:
      'scale-[1.01] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_12px_24px_rgba(54,38,45,0.045)] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_92%)]',
    quiet:
      'scale-[1.005] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_10px_22px_rgba(54,38,45,0.04)] [mask-image:radial-gradient(ellipse_at_center,black_68%,transparent_90%)]',
    cover:
      'scale-[0.995] saturate-[0.97] contrast-[0.99] brightness-[1]',
  } as const;

  const flowImageClassMap = {
    embedded:
      'scale-[1.01] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_10px_22px_rgba(54,38,45,0.045)]',
    supporting:
      'scale-[1.01] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_10px_22px_rgba(54,38,45,0.045)]',
    quiet:
      'scale-[1.005] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_8px_18px_rgba(54,38,45,0.04)]',
    cover:
      'scale-[0.992] saturate-[0.97] contrast-[0.99] brightness-[1] drop-shadow-[0_8px_18px_rgba(54,38,45,0.04)] transition-transform duration-700 ease-out group-hover:scale-[1.002]',
  } as const;

  const wrapperClassName = [
    'relative isolate',
    placement === 'flow' ? alignmentClassMap[align] : 'pointer-events-none absolute z-0 w-full',
    placement === 'flow' ? flowWrapperClassMap[variant] : '',
    motionClassMap[motion],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedFrameClassName = [frameClassMap[variant], frameClassName].filter(Boolean).join(' ');
  const resolvedSurfaceClassName = [surfaceClassMap[variant], surfaceClassName].filter(Boolean).join(' ');
  const resolvedVeilClassName = veilClassName
    ? ['pointer-events-none absolute z-10', veilClassName].filter(Boolean).join(' ')
    : '';
  const resolvedImageClassName = [
    props.fill ? 'h-full w-full' : 'w-full',
    placement === 'absolute' ? absoluteImageClassMap[variant] : flowImageClassMap[variant],
    imageClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const backgroundSize = imageClassName.includes('object-contain')
    ? 'contain'
    : imageClassName.includes('object-cover')
      ? 'cover'
      : variant === 'embedded' || variant === 'quiet'
        ? 'contain'
        : 'cover';

  const backgroundStyle = {
    backgroundImage: `url("${src.replace(/"/g, '\\"')}")`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize,
  } as const;

  const isDecorative = alt.trim().length === 0;
  const accessibilityProps = isDecorative
    ? { 'aria-hidden': true as const }
    : {
        role: 'img' as const,
        'aria-label': alt,
      };

  return (
    <div className={wrapperClassName}>
      <div aria-hidden="true" className={auraClassMap[variant]} />
      <div aria-hidden="true" className={washClassMap[variant]} />
      {resolvedVeilClassName ? <div aria-hidden="true" className={resolvedVeilClassName} /> : null}

      <div className={resolvedFrameClassName}>
        <div className={resolvedSurfaceClassName}>
          {props.fill ? (
            <div
              {...accessibilityProps}
              className={[fillMediaClassMap[variant], props.aspectClassName, resolvedImageClassName].filter(Boolean).join(' ')}
              style={backgroundStyle}
            />
          ) : (
            <div
              {...accessibilityProps}
              className={resolvedImageClassName}
              style={{
                ...backgroundStyle,
                aspectRatio: `${props.width} / ${props.height}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
