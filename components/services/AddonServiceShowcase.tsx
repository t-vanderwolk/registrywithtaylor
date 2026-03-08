'use client';

import { useState } from 'react';

import AddonServiceCard, { type AddonServiceCardData } from '@/components/services/AddonServiceCard';

type AddonServiceShowcaseProps = {
  services: AddonServiceCardData[];
};

export default function AddonServiceShowcase({
  services,
}: AddonServiceShowcaseProps) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    services.length ? (
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Additional Services</p>

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:grid-cols-3">
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
