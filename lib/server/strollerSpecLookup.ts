import prisma from '@/lib/server/prisma';

export type StrollerRealSpecs = {
  ownWeightLbs: number | null;
  maxWeightLbs: number | null;
  foldType: string | null;
  suitableFromBirth: boolean;
  suitableForJogging: boolean;
};

/**
 * Real, structured specs for a stroller (from the StrollerSpec model, populated
 * from the feed). Returns null when the stroller or its spec row doesn't exist.
 */
export async function getStrollerRealSpecs(
  brand: string,
  model: string,
): Promise<StrollerRealSpecs | null> {
  const stroller = await prisma.stroller.findFirst({
    where: {
      brand: { equals: brand, mode: 'insensitive' },
      model: { equals: model, mode: 'insensitive' },
    },
    select: {
      spec: {
        select: {
          ownWeightLbs: true,
          maxWeightLbs: true,
          foldType: true,
          suitableFromBirth: true,
          suitableForJogging: true,
        },
      },
    },
  });
  return stroller?.spec ?? null;
}
