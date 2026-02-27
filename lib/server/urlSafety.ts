import { isIP } from 'node:net';

export function isHttps(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getHostname(value: string) {
  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.trim().toLowerCase();
    if (!hostname) {
      return null;
    }

    if (isIP(hostname) !== 0) {
      return null;
    }

    return hostname;
  } catch {
    return null;
  }
}

export function isDomainAllowed(hostname: string, allowedDomains: string[]) {
  if (!hostname || allowedDomains.length === 0) {
    return false;
  }

  if (isIP(hostname) !== 0) {
    return false;
  }

  return allowedDomains.some((entry) => {
    const domain = entry.trim().toLowerCase();
    if (!domain || isIP(domain) !== 0) {
      return false;
    }

    return hostname === domain || hostname.endsWith(`.${domain}`);
  });
}
