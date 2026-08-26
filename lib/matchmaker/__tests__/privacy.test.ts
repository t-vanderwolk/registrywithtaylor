import { describe, expect, it } from 'vitest';

import {
  assertPublicPayloadSafe,
  containsForbiddenPublicField,
  findForbiddenPublicFields,
  isForbiddenPublicKey,
  MatchmakerPrivacyError,
  maskEmailForDisplay,
  PUBLIC_PROFILE_ALLOWLIST,
} from '../privacy';

describe('privacy — the §23 forbidden list', () => {
  it('catches contact and identity fields under any naming style', () => {
    for (const key of [
      'email', 'recipientEmail', 'giverEmail', 'contact_email', 'Email',
      'phone', 'phoneNumber', 'address', 'shippingAddress', 'dob', 'dateOfBirth',
    ]) {
      expect(isForbiddenPublicKey(key)).toBe(true);
    }
  });

  it('catches medical, financial, and auth material', () => {
    for (const key of [
      'medicalNotes', 'diagnosis', 'hospital', 'financialNeed', 'income',
      'cardLast4', 'ssn', 'password', 'passwordHash', 'tokenHash', 'sessionId',
    ]) {
      expect(isForbiddenPublicKey(key)).toBe(true);
    }
  });

  it('catches internal moderation and proof material (Part G)', () => {
    for (const key of [
      'moderationNotes', 'internalNote', 'proofNote', 'externalOrderRef',
      'receiptUrl', 'consentSnapshot',
    ]) {
      expect(isForbiddenPublicKey(key)).toBe(true);
    }
  });

  it('catches internal identifiers that must never be public (§37)', () => {
    for (const key of [
      'userId', 'registryId', 'registryCanonicalKey', 'photoMediaId',
      'reviewedById', 'actorUserId', 'admissionInviteId', 'giftCertificateId',
    ]) {
      expect(isForbiddenPublicKey(key)).toBe(true);
    }
  });

  it('does not flag legitimate public keys', () => {
    for (const key of PUBLIC_PROFILE_ALLOWLIST) {
      expect(isForbiddenPublicKey(key)).toBe(false);
    }
  });
});

describe('privacy — deep payload scanning', () => {
  it('finds a leak nested inside objects and arrays', () => {
    const payload = {
      profiles: [
        { publicSlug: 'ok' },
        { publicSlug: 'bad', owner: { recipientEmail: 'a@b.com' } },
      ],
    };
    const hits = findForbiddenPublicFields(payload);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.path).toBe('$.profiles[1].owner.recipientEmail');
    expect(containsForbiddenPublicField(payload)).toBe(true);
  });

  it('reports nothing for a clean payload', () => {
    expect(findForbiddenPublicFields({ publicSlug: 'x', priorityNeeds: ['Car seat'] })).toEqual([]);
  });

  it('survives circular references without hanging', () => {
    const node: Record<string, unknown> = { publicSlug: 'x' };
    node.self = node;
    expect(() => findForbiddenPublicFields(node)).not.toThrow();
    expect(findForbiddenPublicFields(node)).toEqual([]);
  });

  it('assertPublicPayloadSafe throws a typed error naming the leak', () => {
    expect(() => assertPublicPayloadSafe({ userId: 'u_1' })).toThrow(MatchmakerPrivacyError);
    try {
      assertPublicPayloadSafe({ nested: { giverEmail: 'x@y.com' } });
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(MatchmakerPrivacyError);
      expect((error as MatchmakerPrivacyError).hits[0]?.key).toBe('giverEmail');
    }
  });

  it('assertPublicPayloadSafe returns clean payloads unchanged', () => {
    const payload = { publicSlug: 'x' };
    expect(assertPublicPayloadSafe(payload)).toBe(payload);
  });
});

describe('privacy — admin display masking', () => {
  it('masks the local part but keeps the domain legible', () => {
    expect(maskEmailForDisplay('taylor@example.com')).toBe('t*****@example.com');
    expect(maskEmailForDisplay('a@example.com')).toBe('a*@example.com');
  });

  it('never returns the original address', () => {
    const email = 'someone@example.com';
    expect(maskEmailForDisplay(email)).not.toBe(email);
  });

  it('degrades safely on malformed input', () => {
    expect(maskEmailForDisplay('not-an-email')).toBe('***');
    expect(maskEmailForDisplay('@example.com')).toBe('***');
  });
});
