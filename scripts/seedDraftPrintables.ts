import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PrintableSeed = {
  title: string;
  slug: string;
  description: string;
  category: string;
  filePath?: string | null;
};

const draftPrintables: PrintableSeed[] = [
  {
    title: 'Nursery Essentials Checklist (2026)',
    slug: 'nursery-essentials-checklist-2026',
    description: 'A printable checklist covering the true nursery essentials without overbuying.',
    category: 'Nursery',
    filePath: null,
  },
  {
    title: 'Baby Registry Planning Worksheet',
    slug: 'baby-registry-planning-worksheet',
    description: 'A structured worksheet to build a registry with clarity and intention.',
    category: 'Registry',
    filePath: null,
  },
  {
    title: 'Hospital Bag Checklist (2026)',
    slug: 'hospital-bag-checklist-2026',
    description: 'A practical, streamlined hospital packing list for expecting parents.',
    category: 'Birth Prep',
    filePath: null,
  },
  {
    title: 'Travel With Baby Packing List',
    slug: 'travel-with-baby-packing-list',
    description: 'A concise printable packing list for travel days, overnights, and spring break trips.',
    category: 'Travel',
    filePath: null,
  },
  {
    title: 'Newborn Feeding Log',
    slug: 'newborn-feeding-log',
    description: 'A simple log for tracking feeding times, quantities, and daily rhythm in the early weeks.',
    category: 'Feeding',
    filePath: null,
  },
  {
    title: 'Sleep Routine Tracker',
    slug: 'sleep-routine-tracker',
    description: 'A printable tracker for naps, bedtime, wake windows, and sleep pattern observations.',
    category: 'Sleep',
    filePath: null,
  },
  {
    title: 'Postpartum Recovery Checklist',
    slug: 'postpartum-recovery-checklist',
    description: 'A supportive checklist for recovery planning, household readiness, and care essentials.',
    category: 'Postpartum',
    filePath: null,
  },
  {
    title: 'Twins Preparation Checklist',
    slug: 'twins-preparation-checklist',
    description: 'A practical checklist for preparing systems, gear, and support for twins.',
    category: 'Twins',
    filePath: null,
  },
  {
    title: 'Minimalist Baby Registry Guide',
    slug: 'minimalist-baby-registry-guide',
    description: 'A focused printable guide for building a registry around fewer, better, more useful choices.',
    category: 'Registry',
    filePath: null,
  },
  {
    title: 'Baby Gear Comparison Worksheet',
    slug: 'baby-gear-comparison-worksheet',
    description: 'A comparison worksheet for sorting features, tradeoffs, and best-fit gear decisions.',
    category: 'Gear & Safety',
    filePath: null,
  },
];

async function main() {
  for (const printable of draftPrintables) {
    const existing = await prisma.printableResource.findUnique({
      where: { slug: printable.slug },
    });

    if (existing) {
      console.log(`Skipped (already exists): ${printable.slug}`);
      continue;
    }

    await prisma.printableResource.create({
      data: {
        title: printable.title,
        slug: printable.slug,
        description: printable.description,
        category: printable.category,
        filePath: printable.filePath ?? null,
        isPublished: false,
        publishedAt: null,
      },
    });

    console.log(`Created draft printable: ${printable.slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
