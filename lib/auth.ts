import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const Roles = {
  USER: Role.USER,
  ADMIN: Role.ADMIN,
} as const;

export type AppRole = Role;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword?: string | null) {
  if (!hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
}
