'use client';

import Link from 'next/link';
import { Body } from '@/components/Typography';

const services = [
  {
    title: 'Registry Curation',
    description: 'Distill every category so you gift and register with clarity.',
    reassurance: 'Focus on what fits your life.',
    href: '/how-it-works#registry',
    icon: '/assets/icons/icon-services-registry.png',
  },
  {
    title: 'Nursery & Home Setup',
    description: 'Calm layouts, textiles, and lighting that keep safety and serenity in balance.',
    reassurance: 'Create calm flow from day one.',
    href: '/contact',
    icon: '/assets/icons/icon-services-nursery.png',
  },
  {
    title: 'Gear Planning & Personal Shopping',
    description: 'Research-backed gear and gifting lists so you can stay fully present.',
    reassurance: 'We handle the research.',
    href: '/contact',
    icon: '/assets/icons/icon-services-shopping.png',
  },
  {
    title: 'Family Dynamics Support',
    description: 'Gentle scripts, boundaries, and expert perspective for tricky conversations.',
    reassurance: 'Kind, confident guidance.',
    href: '/contact',
    icon: '/assets/icons/icon-services-family.png',
  },
];

export default function ServicesPreview() {
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <p className="hero__eyebrow">Services</p>
        <h2 className="section-title">Bespoke planning services</h2>
        <Body>
          Bespoke support that keeps gracious, calm parenting prep in clear view — without pressure or overload.
        </Body>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <article key={service.title} className="service-card card-surface">
            <span
              className="service-card__icon"
              role="presentation"
              aria-hidden="true"
              style={{ backgroundImage: `url(${service.icon})` }}
            />
            <h3>{service.title}</h3>
            <Body className="body-copy--full">{service.description}</Body>
            <Body className="micro-text body-copy--full">{service.reassurance}</Body>
            <Link className="link-text" href={service.href}>
              Learn more
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
