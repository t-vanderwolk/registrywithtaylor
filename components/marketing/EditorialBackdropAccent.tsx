import EditorialInsetImage from '@/components/marketing/EditorialInsetImage';

type EditorialBackdropAccentProps = {
  src: string;
  width: number;
  height: number;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

export default function EditorialBackdropAccent({
  src,
  width,
  height,
  align = 'center',
  className = '',
}: EditorialBackdropAccentProps) {
  return (
    <EditorialInsetImage
      src={src}
      alt=""
      width={width}
      height={height}
      variant="paper"
      align={align}
      mode="overlay"
      textOverlay
      className={['inset-x-0 w-full max-w-none', className].filter(Boolean).join(' ')}
    />
  );
}
