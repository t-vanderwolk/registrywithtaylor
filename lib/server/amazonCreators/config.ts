import 'server-only';

import {
  AMAZON_CREATORS_DEFAULT_API_BASE_URL,
  AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION,
  AMAZON_CREATORS_DEFAULT_MARKETPLACE,
  AMAZON_CREATORS_DEFAULT_PARTNER_TAG,
  AMAZON_CREATORS_TOKEN_ENDPOINT_BY_VERSION,
} from '@/lib/server/amazonCreators/constants';

export type AmazonCreatorsConfig = {
  apiBaseUrl: string;
  clientId: string;
  clientSecret: string;
  credentialVersion: string;
  marketplace: string;
  partnerTag: string;
  tokenEndpoint: string;
};

type ConfigOptions = {
  requireCredentials?: boolean;
};

type Environment = Readonly<Record<string, string | undefined>>;

function clean(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCredentialVersion(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION;
  return trimmed.startsWith('v') ? trimmed : `v${trimmed}`;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getAmazonCreatorsConfig(
  env: Environment = process.env,
  options: ConfigOptions = {},
): AmazonCreatorsConfig | null {
  const requireCredentials = options.requireCredentials ?? true;
  const clientId = clean(env.AMAZON_CREATORS_CLIENT_ID);
  const clientSecret = clean(env.AMAZON_CREATORS_CLIENT_SECRET);
  const credentialVersion = normalizeCredentialVersion(
    clean(env.AMAZON_CREATORS_CREDENTIAL_VERSION) || AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION,
  );
  const marketplace = clean(env.AMAZON_CREATORS_MARKETPLACE) || AMAZON_CREATORS_DEFAULT_MARKETPLACE;
  const partnerTag = clean(env.AMAZON_CREATORS_PARTNER_TAG) || AMAZON_CREATORS_DEFAULT_PARTNER_TAG;
  const apiBaseUrl = trimTrailingSlash(
    clean(env.AMAZON_CREATORS_API_BASE_URL) || AMAZON_CREATORS_DEFAULT_API_BASE_URL,
  );
  const tokenEndpoint = AMAZON_CREATORS_TOKEN_ENDPOINT_BY_VERSION[credentialVersion];

  if (!clientId || !clientSecret) {
    if (!requireCredentials) return null;
    throw new Error('Amazon Creators API credentials are missing. Set AMAZON_CREATORS_CLIENT_ID and AMAZON_CREATORS_CLIENT_SECRET.');
  }

  if (!tokenEndpoint) {
    throw new Error(`Unsupported AMAZON_CREATORS_CREDENTIAL_VERSION "${credentialVersion}". Expected v3.1 for the US marketplace.`);
  }

  if (credentialVersion !== AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION) {
    throw new Error(`TMBC Amazon Creators credentials must use ${AMAZON_CREATORS_DEFAULT_CREDENTIAL_VERSION} for ${AMAZON_CREATORS_DEFAULT_MARKETPLACE}.`);
  }

  if (marketplace !== AMAZON_CREATORS_DEFAULT_MARKETPLACE) {
    throw new Error(`TMBC Amazon marketplace must be ${AMAZON_CREATORS_DEFAULT_MARKETPLACE}.`);
  }

  if (partnerTag !== AMAZON_CREATORS_DEFAULT_PARTNER_TAG) {
    throw new Error(`TMBC Amazon partner tag must be ${AMAZON_CREATORS_DEFAULT_PARTNER_TAG}.`);
  }

  return {
    apiBaseUrl,
    clientId,
    clientSecret,
    credentialVersion,
    marketplace,
    partnerTag,
    tokenEndpoint,
  };
}
