import { Prisma } from '@prisma/client';

const TRANSIENT_PRISMA_CONNECTION_ERROR_CODES = new Set(['P1001', 'P1002', 'P1017']);

export function isTransientPrismaConnectionError(error: unknown) {
  return (
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      TRANSIENT_PRISMA_CONNECTION_ERROR_CODES.has(error.code)) ||
    error instanceof Prisma.PrismaClientInitializationError
  );
}
