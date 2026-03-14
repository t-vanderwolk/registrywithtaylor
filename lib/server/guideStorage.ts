import { Prisma } from '@prisma/client';

export const GUIDE_STORAGE_UNAVAILABLE_MESSAGE =
  'Guide storage is not available yet. Add and apply the Prisma migration that creates the Guide and GuideAnalytics tables before using the Guide workspace.';

const GUIDE_TABLE_MARKERS = ['Guide', 'GuideAnalytics'];

export function isGuideStorageUnavailableError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  if (error.code !== 'P2021') {
    return false;
  }

  const tableName =
    typeof error.meta?.table === 'string'
      ? error.meta.table
      : typeof error.message === 'string'
        ? error.message
        : '';

  return GUIDE_TABLE_MARKERS.some((marker) => tableName.includes(marker));
}

function getGuideStorageErrorDetails(error: Prisma.PrismaClientKnownRequestError) {
  const table =
    typeof error.meta?.table === 'string'
      ? error.meta.table
      : typeof error.message === 'string'
        ? error.message
        : 'unknown';

  return {
    code: error.code,
    table,
    message: error.message,
  };
}

export function logGuideStorageUnavailable(context: string, error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    console.error(`[guide-storage] ${context}`, error);
    return;
  }

  console.error(`[guide-storage] ${context}`, getGuideStorageErrorDetails(error));
}
