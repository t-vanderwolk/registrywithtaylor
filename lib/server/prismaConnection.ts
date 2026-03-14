import { Prisma } from '@prisma/client';

const TRANSIENT_PRISMA_CONNECTION_ERROR_CODES = new Set(['P1001', 'P1002', 'P1017']);
const TRANSIENT_PRISMA_CONNECTION_ERROR_PATTERNS = [
  /server has closed the connection/i,
  /can't reach database server/i,
  /timed out/i,
] as const;

function getErrorCode(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}

function getErrorName(error: unknown) {
  if (error && typeof error === 'object' && 'name' in error) {
    const name = (error as { name?: unknown }).name;
    return typeof name === 'string' ? name : undefined;
  }

  return undefined;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }

  return undefined;
}

export function isTransientPrismaConnectionError(error: unknown) {
  const code = getErrorCode(error);
  const name = getErrorName(error);
  const message = getErrorMessage(error) ?? '';

  return (
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      TRANSIENT_PRISMA_CONNECTION_ERROR_CODES.has(error.code)) ||
    (code !== undefined && TRANSIENT_PRISMA_CONNECTION_ERROR_CODES.has(code)) ||
    error instanceof Prisma.PrismaClientInitializationError ||
    name === 'PrismaClientInitializationError' ||
    TRANSIENT_PRISMA_CONNECTION_ERROR_PATTERNS.some((pattern) => pattern.test(message))
  );
}
