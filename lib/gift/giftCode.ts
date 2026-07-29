import { randomInt } from 'node:crypto';

// Unambiguous alphabet (no 0/O/1/I) so codes are easy to read + retype.
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** A human-friendly gift code, e.g. "TMBC-7F2A91". */
export function generateGiftCode(): string {
  let body = '';
  for (let i = 0; i < 6; i += 1) body += ALPHABET[randomInt(ALPHABET.length)];
  return `TMBC-${body}`;
}

/** Normalize user-entered codes: uppercase, strip spaces, ensure TMBC- prefix. */
export function normalizeGiftCode(input: string): string {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '').replace(/^TMBC[-\s]?/i, '');
  return `TMBC-${cleaned}`;
}
