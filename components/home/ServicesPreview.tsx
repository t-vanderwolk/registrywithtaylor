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
          <article
            key={service.title}
            className="service-card card-surface relative overflow-hidden border border-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(31,31,31,0.12)]"
          >
            <Image
              className="service-card__icon"
              src={service.icon}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
            />
            <h3 className="text-center">{service.title}</h3>
            <Body className="body-copy--full !mb-0 !leading-[1.72] text-center text-[0.98rem] text-black/72">
              {service.description}
            </Body>
            <Body className="service-card__subcopy body-copy--full !mb-0 text-center">
              {service.reassurance}
            </Body>
            <details className="service-card__details mt-4 border-t border-black/10 pt-3">
              <summary className="service-card__summary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]">
                Learn more
              </summary>
              <div className="service-card__body">
                <Body className="body-copy--full !mb-0">
                  Tailored to your routines, home setup, and real-day priorities.
                </Body>
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
