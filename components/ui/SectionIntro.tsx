import type { ReactNode } from 'react';
import { Body, Eyebrow, H2 } from '@/components/ui/MarketingHeading';
import SectionDivider from '@/components/ui/SectionDivider';

type SectionIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  spacing?: 'default' | 'tight';
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentWidthClassName?: string;
  dividerClassName?: string;
};

export default function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'center',
  spacing = 'default',
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentWidthClassName = 'max-w-3xl',
  dividerClassName = '',
}: SectionIntroProps) {
  const isCentered = align === 'center';
  const eyebrowSpacingClassName = spacing === 'tight' ? 'mt-2' : 'mt-3';
  const titleSpacingClassName = spacing === 'tight' ? 'mt-2' : 'mt-4';
  const descriptionSpacingClassName = spacing === 'tight' ? 'mt-3' : 'mt-4';

  return (
    <div
      className={[
        contentWidthClassName,
        isCentered ? 'mx-auto text-center' : 'text-left',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={isCentered ? 'flex justify-center' : 'flex justify-start'}>
        <SectionDivider className={dividerClassName} />
      </div>

      {eyebrow ? <Eyebrow className={eyebrowSpacingClassName}>{eyebrow}</Eyebrow> : null}

      <H2 className={[titleSpacingClassName, 'text-neutral-900', titleClassName].filter(Boolean).join(' ')}>
        {title}
      </H2>

      {description ? (
        <Body
          className={[
            descriptionSpacingClassName,
            'max-w-none text-neutral-600',
            descriptionClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {description}
        </Body>
      ) : null}
    </div>
  );
}
