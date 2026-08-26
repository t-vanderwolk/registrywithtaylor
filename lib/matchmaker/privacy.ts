/**
 * Matchmaker privacy rules — pure.
 *
 * Frozen contract (Part G, decision 10, §23, §37):
 *  - The serializer allowlist is the ONLY path to public data.
 *  - Never spread a Prisma row into public API output or React props.
 *  - Forbidden anywhere public: email, phone, addresses, DOB, hospital,
 *    medical, financial, internal notes, receipts/proof, auth data, and the
 *    exact due date.
 *  - External-gift proof is private moderation material and never travels on a
 *    publicly addressable media workflow.
 */

/**
 * Field names that must never appear in any public payload — API JSON, RSC
 * props, HTML, analytics URLs, or Stripe success URLs.
 * Matching is case-insensitive and substring-based so that `recipientEmail`,
 * `giverEmail`, and `email` are all caught by the single token `email`.
 */
export const FORBIDDEN_PUBLIC_FIELD_TOKENS: readonly string[] = [
  'email',
  'phone',
  'address',
  'dateofbirth',
  'dob',
  'hospital',
  'medical',
  'diagnosis',
  'financial',
  'income',
  'card',
  'iban',
  'ssn',
  'password',
  'passwordhash',
  'token',
  'tokenhash',
  'session',
  'moderationnote',
  'internalnote',
  'proofnote',
  'prooforder',
  'externalorderref',
  'receipt',
  'consentsnapshot',
  'userid',
  'registryid',
  'registrycanonicalkey',
  'photomediaid',
  'reviewedbyid',
  'resolvedbyid',
  'nominatedbyid',
  'actoruserid',
  'admissioninviteid',
  'giftcertificateid',
  'duedate',
];

/** The exact, complete set of keys a public Matchmaker profile may carry. */
export const PUBLIC_PROFILE_ALLOWLIST: readonly string[] = [
  'publicSlug',
  'displayFirstName',
  'displayLastInitial',
  'city',
  'state',
  'dueMonth',
  'dueYear',
  'familyStage',
  'photoUrl',
  'shortStory',
  'priorityNeeds',
  'registryUrl',
  'registryReviewed',
  'ownershipReviewed',
];

function normaliseKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z]/g, '');
}

export function isForbiddenPublicKey(key: string): boolean {
  const normalised = normaliseKey(key);
  return FORBIDDEN_PUBLIC_FIELD_TOKENS.some((token) => normalised.includes(token));
}

export type ForbiddenFieldHit = { readonly path: string; readonly key: string };

/**
 * Walks any value and reports every key that would leak private data.
 * Used by the serializer's own tests and available to route-level regression
 * tests in later steps.
 */
export function findForbiddenPublicFields(value: unknown, basePath = '$'): ForbiddenFieldHit[] {
  const hits: ForbiddenFieldHit[] = [];
  const seen = new Set<unknown>();

  const walk = (node: unknown, path: string): void => {
    if (node === null || typeof node !== 'object') return;
    if (seen.has(node)) return;
    seen.add(node);

    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }

    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      const childPath = `${path}.${key}`;
      if (isForbiddenPublicKey(key)) {
        hits.push({ path: childPath, key });
      }
      walk(child, childPath);
    }
  };

  walk(value, basePath);
  return hits;
}

export function containsForbiddenPublicField(value: unknown): boolean {
  return findForbiddenPublicFields(value).length > 0;
}

export class MatchmakerPrivacyError extends Error {
  readonly hits: readonly ForbiddenFieldHit[];

  constructor(hits: readonly ForbiddenFieldHit[]) {
    super(
      `Matchmaker public payload contains forbidden field(s): ${hits
        .map((h) => h.path)
        .join(', ')}`,
    );
    this.name = 'MatchmakerPrivacyError';
    this.hits = hits;
  }
}

/** Throws if a payload about to leave the server carries anything private. */
export function assertPublicPayloadSafe<T>(value: T): T {
  const hits = findForbiddenPublicFields(value);
  if (hits.length > 0) throw new MatchmakerPrivacyError(hits);
  return value;
}

/**
 * Admin-facing masking. TMBC always retains the giver's real email privately
 * (decision 16); this is for on-screen display only, never for storage.
 */
export function maskEmailForDisplay(email: string): string {
  const at = email.lastIndexOf('@');
  if (at <= 0) return '***';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const head = local.slice(0, 1);
  return `${head}${'*'.repeat(Math.max(local.length - 1, 1))}@${domain}`;
}
