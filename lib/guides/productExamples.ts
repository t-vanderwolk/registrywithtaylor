export type GuideProductSpecGroup = {
  label: string;
  items: string[];
};

export type GuideProductExampleData = {
  name: string;
  brand?: string;
  productName?: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  typeLabel?: string | null;
  bestFor?: string;
  shortReview?: string;
  specGroups?: GuideProductSpecGroup[];
  notes?: string[];
  ctaLabel?: string | null;
  standout?: string | null;
  pros?: string[];
};
