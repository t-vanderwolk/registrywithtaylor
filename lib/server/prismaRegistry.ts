/**
 * Typed accessor for prisma.registry.
 *
 * The Registry model is in prisma/schema.prisma but `prisma generate` has
 * not been run since it was added, so the generated client doesn't expose
 * `PrismaClient.registry` yet.
 *
 * A `postinstall` script in package.json now runs `prisma generate`
 * automatically on every `npm install` and Heroku deploy, which will
 * regenerate the client and make the real `prisma.registry` available.
 * Once that's done, usages of this module can be replaced with direct
 * `prisma.registry` calls and this file can be deleted.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import prismaClient from '@/lib/server/prisma';

// ─── Shape of a Registry record returned by Prisma ───────────────────────────

export type RegistryPlatform =
  | 'BABYLIST'
  | 'AMAZON'
  | 'TARGET'
  | 'BUYBUYBABY'
  | 'WALMART'
  | 'OTHER';

export type RegistryRecord = {
  id:             string;
  userId:         string;
  platform:       RegistryPlatform;
  name:           string | null;
  url:            string;
  itemCount:      number | null;
  completedCount: number | null;
  notes:          string | null;
  isPublic:       boolean;
  createdAt:      Date;
  updatedAt:      Date;
};

// ─── Delegate ─────────────────────────────────────────────────────────────────

const _delegate = (prismaClient as any).registry;

export const registryDelegate = {
  findMany:   (args?: any) => _delegate.findMany(args)   as Promise<RegistryRecord[]>,
  findUnique: (args:  any) => _delegate.findUnique(args) as Promise<RegistryRecord | null>,
  count:      (args?: any) => _delegate.count(args)      as Promise<number>,
  create:     (args:  any) => _delegate.create(args)     as Promise<RegistryRecord>,
  update:     (args:  any) => _delegate.update(args)     as Promise<RegistryRecord>,
  delete:     (args:  any) => _delegate.delete(args)     as Promise<RegistryRecord>,
  groupBy:    (args:  any) => _delegate.groupBy(args)    as Promise<any[]>,
};
