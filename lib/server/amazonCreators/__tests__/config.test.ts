import { describe, expect, it } from 'vitest';

import { getAmazonCreatorsConfig } from '@/lib/server/amazonCreators/config';

const BASE_ENV = {
  AMAZON_CREATORS_CLIENT_ID: 'client-id',
  AMAZON_CREATORS_CLIENT_SECRET: 'client-secret',
  AMAZON_CREATORS_CREDENTIAL_VERSION: 'v3.1',
  AMAZON_CREATORS_MARKETPLACE: 'www.amazon.com',
  AMAZON_CREATORS_PARTNER_TAG: 'taylormadebab-20',
};

describe('Amazon Creators config', () => {
  it('validates the required TMBC env values', () => {
    const config = getAmazonCreatorsConfig(BASE_ENV);

    expect(config).toMatchObject({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      credentialVersion: 'v3.1',
      marketplace: 'www.amazon.com',
      partnerTag: 'taylormadebab-20',
      tokenEndpoint: 'https://api.amazon.com/auth/o2/token',
    });
  });

  it('requires private credentials for sync runs', () => {
    expect(() => getAmazonCreatorsConfig({ AMAZON_CREATORS_CLIENT_ID: '' })).toThrow(/credentials are missing/i);
  });

  it('allows render code to treat missing credentials as disabled', () => {
    expect(getAmazonCreatorsConfig({}, { requireCredentials: false })).toBeNull();
  });

  it('rejects the wrong marketplace or partner tag', () => {
    expect(() =>
      getAmazonCreatorsConfig({ ...BASE_ENV, AMAZON_CREATORS_MARKETPLACE: 'www.amazon.ca' }),
    ).toThrow(/marketplace/i);

    expect(() =>
      getAmazonCreatorsConfig({ ...BASE_ENV, AMAZON_CREATORS_PARTNER_TAG: 'other-20' }),
    ).toThrow(/partner tag/i);
  });
});
