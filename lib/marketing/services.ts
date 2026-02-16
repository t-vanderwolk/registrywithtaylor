export type MarketingService = {
  title: string;
  description: string;
  reassurance: string;
  href: string;
  icon: string;
};

export const marketingServices: MarketingService[] = [
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
  {
    title: 'Baby Shower & Gifting Guidance',
    description: 'Coordinate invitations, wish lists, and thank-yous that respect every guest.',
    reassurance: 'Serve your people thoughtfully.',
    href: '/contact',
    icon: '/assets/icons/icon-services-babyshower.png',
  },
  {
    title: 'Travel & Everyday Logistics',
    description: 'Packing lists, rental coordination, and travel prep to keep life moving gently.',
    reassurance: 'Keep life moving gently.',
    href: '/contact',
    icon: '/assets/icons/icon-services-travel.png',
  },
];

export const marketingServicesPreview: MarketingService[] = marketingServices.slice(0, 4);
