export type AdminNavLink = {
  href: string;
  label: string;
  editorOnly?: boolean;
};

export type AdminNavSection = {
  label: string;
  summary?: string;
  links: AdminNavLink[];
};

const HIDDEN_ADMIN_PREFIXES = ['/admin/academy', '/admin/guides'];
const HIDDEN_ADMIN_ROUTES = new Set(['/admin/academy-analytics', '/academy']);

export function isHiddenAdminLink(href: string) {
  return HIDDEN_ADMIN_ROUTES.has(href) || HIDDEN_ADMIN_PREFIXES.some((prefix) => href.startsWith(prefix));
}

const EDITOR_NAV_SECTIONS: AdminNavSection[] = [
  {
    label: 'Overview',
    links: [{ label: 'Dashboard', href: '/admin' }],
  },
  {
    label: 'Products & Compatibility',
    summary: 'Catalog records, stroller data, car seats, SKUs, images, and travel-system matching.',
    links: [
      { label: 'Strollers', href: '/admin/strollers' },
      { label: 'Car Seats', href: '/admin/car-seats' },
      { label: 'Compatibility', href: '/admin/catalog/compatibility' },
      { label: 'Affiliate Catalog', href: '/admin/catalog' },
      { label: 'Catalog Health', href: '/admin/catalog/health' },
      { label: 'Babylist SKUs', href: '/admin/babylist' },
      { label: 'Recategorize', href: '/admin/catalog/recategorize' },
      { label: 'GoodBuy Gear Badges', href: '/admin/catalog/goodbuygear' },
    ],
  },
  {
    label: 'Checklist',
    summary: 'Checklist categories, items, and product picks shown on the public checklist.',
    links: [{ label: 'Checklist Picks', href: '/admin/checklist' }],
  },
  {
    label: 'Publishing',
    summary: 'Public blog workflow, editorial planning, reusable media, and categories.',
    links: [
      { label: 'Posts', href: '/admin/blog' },
      { label: 'Planner', href: '/admin/blog/planner' },
      { label: 'Categories', href: '/admin/blog/categories' },
      { label: 'Media Library', href: '/admin/media' },
    ],
  },
  {
    label: 'Affiliate',
    summary: 'Affiliate programs, partner metadata, and trackable short links.',
    links: [
      { label: 'Affiliate Canon', href: '/admin/affiliates' },
      { label: 'Partners', href: '/admin/partners' },
      { label: 'Short Links', href: '/admin/affiliate-links' },
    ],
  },
  {
    label: 'Clients & Requests',
    summary: 'Member records, waitlist enrollment, consultations, inquiries, and certificates.',
    links: [
      { label: 'Waitlist & Enrollment', href: '/admin/members' },
      { label: 'Consultations', href: '/admin/consultations' },
      { label: 'Inquiries', href: '/admin/inquiries' },
      { label: 'Gift Certificates', href: '/admin/gifts' },
    ],
  },
  {
    label: 'Analytics',
    summary: 'Traffic, publishing performance, tools, and affiliate activity.',
    links: [{ label: 'Analytics Overview', href: '/admin/analytics' }],
  },
];

const REVIEWER_NAV_SECTIONS: AdminNavSection[] = [
  {
    label: 'Reviewer',
    links: [
      { label: 'Reviewer Home', href: '/dashboard/reviewer' },
      { label: 'Admin Preview', href: '/admin' },
    ],
  },
  {
    label: 'Publishing',
    summary: 'Review public blog structure without editing content.',
    links: [
      { label: 'Blog Overview', href: '/admin/blog' },
      { label: 'Categories', href: '/admin/blog/categories' },
    ],
  },
  {
    label: 'Analytics',
    summary: 'Inspect high-level site and content performance.',
    links: [{ label: 'Analytics Summary', href: '/admin/analytics' }],
  },
  {
    label: 'Public Site',
    links: [
      { label: 'Homepage', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];

function visibleSections(sections: AdminNavSection[]) {
  return sections
    .map((section) => ({ ...section, links: section.links.filter((link) => !isHiddenAdminLink(link.href)) }))
    .filter((section) => section.links.length > 0);
}

export function getAdminNavSections(isReviewerMode: boolean) {
  return visibleSections(isReviewerMode ? REVIEWER_NAV_SECTIONS : EDITOR_NAV_SECTIONS);
}

export function getAdminDashboardNavGroups(isReviewerMode: boolean) {
  const hiddenDashboardGroups = new Set(['Overview', 'Reviewer', 'Public Site']);

  return getAdminNavSections(isReviewerMode).filter((section) => !hiddenDashboardGroups.has(section.label));
}
