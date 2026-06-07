/**
 * Unified submodule resolver for /learn/[path]/[module]/[submodule].
 *
 * Maps (path, module, submodule) → LearnModuleData so the single dynamic
 * route can serve all five submodule groups without per-group page files.
 *
 * The builders are the same ones used by the /academy/* pages — we just
 * override href and breadcrumbs to point to /learn/*.
 */
import {
  STROLLER_CATEGORY_GUIDE_SLUGS,
  type StrollerCategoryGuideSlug,
} from '@/lib/guides/strollerCluster';
import {
  CAR_SEAT_CATEGORY_GUIDE_SLUGS,
  type CarSeatCategoryGuideSlug,
} from '@/lib/guides/carSeatCategoryGuides';
import {
  buildStrollerFoundationsAcademySubmoduleModule,
  isStrollerFoundationsAcademySubmoduleSlug,
} from '@/lib/academy/strollerFoundationsAcademy';
import {
  buildCarSeatFoundationsAcademySubmoduleModule,
  isCarSeatFoundationsAcademySubmoduleSlug,
} from '@/lib/academy/carSeatFoundationsAcademy';
import {
  buildDailyUseGearAcademySubmoduleModule,
  isDailyUseGearAcademySubmoduleSlug,
  type DailyUseGearAcademySubmoduleSlug,
} from '@/lib/academy/dailyUseGearAcademy';
import {
  buildNurseryFurnitureAcademySubmoduleModule,
  isNurseryFurnitureCategorySlug,
  type NurseryFurnitureCategorySlug,
} from '@/lib/academy/nurseryFurnitureAcademy';
import {
  buildRegistryWelcomeBoxesAcademySubmoduleModule,
  isRegistryWelcomeBoxesAcademySubmoduleSlug,
  type RegistryWelcomeBoxesSubmoduleSlug,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import type { LearnModuleData } from '@/components/learn/LearnModuleLayout';
import type { AcademyBreadcrumbItem } from '@/lib/academy/content';

// ─── Slug registries ──────────────────────────────────────────────────────────

const DAILY_USE_GEAR_SLUGS: DailyUseGearAcademySubmoduleSlug[] = [
  'carrier',
  'highchair',
  'baby-bath',
  'pack-and-play',
  'swing-bouncer',
  'daily-support-gear',
];

const NURSERY_FURNITURE_SLUGS: NurseryFurnitureCategorySlug[] = [
  'cribs',
  'pack-and-play',
  'gliders',
  'dressers-changing',
  'diaper-pails',
  'baby-monitors',
  'baby-proofing',
];

const WELCOME_BOX_SLUGS: RegistryWelcomeBoxesSubmoduleSlug[] = [
  'target',
  'babylist',
  'amazon',
  'macrobaby',
];

// ─── Static params ────────────────────────────────────────────────────────────

export type LearnSubmoduleParams = {
  path: string;
  module: string;
  submodule: string;
};

export function getLearnSubmoduleStaticParams(): LearnSubmoduleParams[] {
  return [
    ...(STROLLER_CATEGORY_GUIDE_SLUGS as readonly StrollerCategoryGuideSlug[]).map((s) => ({
      path: 'gear',
      module: 'stroller-foundations',
      submodule: s,
    })),
    ...(CAR_SEAT_CATEGORY_GUIDE_SLUGS as readonly CarSeatCategoryGuideSlug[]).map((s) => ({
      path: 'gear',
      module: 'car-seat-foundations',
      submodule: s,
    })),
    ...DAILY_USE_GEAR_SLUGS.map((s) => ({
      path: 'gear',
      module: 'daily-use-gear',
      submodule: s,
    })),
    ...NURSERY_FURNITURE_SLUGS.map((s) => ({
      path: 'nursery',
      module: 'furniture-that-actually-works',
      submodule: s,
    })),
    ...WELCOME_BOX_SLUGS.map((s) => ({
      path: 'registry',
      module: 'welcome-boxes-perks',
      submodule: s,
    })),
  ];
}

// ─── Breadcrumb helpers ───────────────────────────────────────────────────────

function buildSubmoduleBreadcrumbs(
  pathSlug: string,
  pathLabel: string,
  moduleSlug: string,
  moduleLabel: string,
  submoduleTitle: string,
): AcademyBreadcrumbItem[] {
  return [
    { label: 'Academy', href: '/learn' },
    { label: pathLabel, href: `/learn/${pathSlug}` },
    { label: moduleLabel, href: `/learn/${pathSlug}/${moduleSlug}` },
    { label: submoduleTitle },
  ];
}

// ─── Resolver ─────────────────────────────────────────────────────────────────

/**
 * Returns LearnModuleData with /learn/* href and breadcrumbs,
 * or null if the (path, module, submodule) combo is not valid.
 */
export function resolveLearnSubmodule(
  path: string,
  module: string,
  submodule: string,
): LearnModuleData | null {
  // ── Gear: Stroller Foundations ──────────────────────────────────────────
  if (path === 'gear' && module === 'stroller-foundations') {
    if (!isStrollerFoundationsAcademySubmoduleSlug(submodule)) return null;
    const base = buildStrollerFoundationsAcademySubmoduleModule(submodule);
    const href = `/learn/gear/stroller-foundations/${submodule}`;
    return {
      ...base,
      href,
      breadcrumb: buildSubmoduleBreadcrumbs(
        'gear', 'Gear', 'stroller-foundations', 'Stroller Foundations', base.title,
      ),
    };
  }

  // ── Gear: Car Seat Foundations ──────────────────────────────────────────
  if (path === 'gear' && module === 'car-seat-foundations') {
    if (!isCarSeatFoundationsAcademySubmoduleSlug(submodule)) return null;
    const base = buildCarSeatFoundationsAcademySubmoduleModule(submodule);
    const href = `/learn/gear/car-seat-foundations/${submodule}`;
    return {
      ...base,
      href,
      breadcrumb: buildSubmoduleBreadcrumbs(
        'gear', 'Gear', 'car-seat-foundations', 'Car Seat Foundations', base.title,
      ),
    };
  }

  // ── Gear: Daily Use Gear ────────────────────────────────────────────────
  if (path === 'gear' && module === 'daily-use-gear') {
    if (!isDailyUseGearAcademySubmoduleSlug(submodule)) return null;
    const base = buildDailyUseGearAcademySubmoduleModule(
      submodule as DailyUseGearAcademySubmoduleSlug,
    );
    const href = `/learn/gear/daily-use-gear/${submodule}`;
    return {
      ...base,
      href,
      breadcrumb: buildSubmoduleBreadcrumbs(
        'gear', 'Gear', 'daily-use-gear', 'Daily Use Gear', base.title,
      ),
    };
  }

  // ── Nursery: Furniture That Actually Works ──────────────────────────────
  if (path === 'nursery' && module === 'furniture-that-actually-works') {
    if (!isNurseryFurnitureCategorySlug(submodule)) return null;
    const base = buildNurseryFurnitureAcademySubmoduleModule(
      submodule as NurseryFurnitureCategorySlug,
    );
    const href = `/learn/nursery/furniture-that-actually-works/${submodule}`;
    return {
      ...base,
      href,
      breadcrumb: buildSubmoduleBreadcrumbs(
        'nursery', 'Nursery', 'furniture-that-actually-works', 'Furniture That Actually Works', base.title,
      ),
    };
  }

  // ── Registry: Welcome Boxes & Perks ────────────────────────────────────
  if (path === 'registry' && module === 'welcome-boxes-perks') {
    if (!isRegistryWelcomeBoxesAcademySubmoduleSlug(submodule)) return null;
    const base = buildRegistryWelcomeBoxesAcademySubmoduleModule(
      submodule as RegistryWelcomeBoxesSubmoduleSlug,
    );
    const href = `/learn/registry/welcome-boxes-perks/${submodule}`;
    return {
      ...base,
      href,
      breadcrumb: buildSubmoduleBreadcrumbs(
        'registry', 'Registry', 'welcome-boxes-perks', 'Welcome Boxes & Perks', base.title,
      ),
    };
  }

  return null;
}
