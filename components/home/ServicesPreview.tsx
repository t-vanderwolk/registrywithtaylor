'use client';

import Image from 'next/image';
import { Body } from '@/components/Typography';
import { marketingServicesPreview } from '@/lib/marketing/services';

export default function ServicesPreview() {
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <p className="hero__eyebrow">Services</p>
        <h2 className="section-title">Bespoke planning services</h2>
        <Body className="mx-auto text-center">
          Bespoke support that keeps gracious, calm parenting prep in clear view — without pressure or overload.
        </Body>
      </div>
      <div className="service-grid">
        {marketingServicesPreview.map((service) => (
          <article key={service.title} className="service-card card-surface">
            <Image
              className="service-card__icon"
              src={service.icon}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
            />
            <h3>{service.title}</h3>
            <Body className="service-card__subcopy body-copy--full">{service.reassurance}</Body>
            <details className="service-card__details">
              <summary className="service-card__summary">Learn more</summary>
              <div className="service-card__body">
                <Body className="body-copy--full">{service.description}</Body>
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
