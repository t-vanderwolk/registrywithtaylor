'use client';

import { useState } from 'react';

import AddonServiceCard, { type AddonServiceCardData } from '@/components/services/AddonServiceCard';

type AddonServiceShowcaseProps = {
  services: AddonServiceCardData[];
  gridClassName?: string;
  equalHeight?: boolean;
};

export default function AddonServiceShowcase({
  services,
  gridClassName = '',
  equalHeight = false,
}: AddonServiceShowcaseProps) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    services.length ? (
      <div>
        <div
          className={[
            'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
            equalHeight ? 'items-stretch' : 'items-start',
            gridClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {services.map((service) => (
            <AddonServiceCard
              key={service.title}
              {...service}
              isOpen={openTitle === service.title}
              onToggle={() => setOpenTitle((current) => (current === service.title ? null : service.title))}
            />
          ))}
        </div>
      </div>
    ) : null
  );
}
