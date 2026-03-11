import type { ReactNode } from 'react';
import { Body, Eyebrow, H2 } from '@/components/ui/MarketingHeading';
import SectionDivider from '@/components/ui/SectionDivider';

type SectionIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
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
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentWidthClassName = 'max-w-3xl',
  dividerClassName = '',
}: SectionIntroProps) {
  const isCentered = align === 'center';

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

      {eyebrow ? <Eyebrow className="mt-3">{eyebrow}</Eyebrow> : null}

      <H2 className={['mt-4 text-neutral-900', titleClassName].filter(Boolean).join(' ')}>
        {title}
      </H2>

      {description ? (
        <Body
          className={[
            'mt-4 max-w-none text-neutral-600',
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
