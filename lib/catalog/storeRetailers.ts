/**
 * Names the store behind a hand-added (manual_tmbc) catalog link, so a Target,
 * Nordstrom or brand-site listing gets its own "Shop Target" / "Shop Chicco"
 * button instead of borrowing another retailer's.
 *
 * The finder and the tools used to file any unrecognised host under Amazon,
 * which put an Amazon label on a Target (or Silver Cross, or Bombi) link.
 */

/** Registrable domain → button name. Matching includes subdomains (us.britax.com). */
const STORE_HOSTS: Record<string, string> = {
  'target.com': 'Target',
  'nordstrom.com': 'Nordstrom',
  'bloomingdales.com': "Bloomingdale's",
  'walmart.com': 'Walmart',
  'albeebaby.com': 'Albee Baby',
  'anbbaby.com': 'ANB Baby',
  'strolleria.com': 'Strolleria',
  'potterybarnkids.com': 'Pottery Barn Kids',
  'bombigear.com': 'Bombi',
  'babyjogger.com': 'Baby Jogger',
  'britax.com': 'Britax',
  'bugaboo.com': 'Bugaboo',
  'chiccousa.com': 'Chicco',
  'cybex-online.com': 'Cybex',
  'deltachildren.com': 'Delta Children',
  'ergobaby.com': 'Ergobaby',
  'joolz.com': 'Joolz',
  'maxicosi.com': 'Maxi-Cosi',
  'mimakidsusa.com': 'Mima',
  'nunababy.com': 'Nuna',
  'orbitbaby.com': 'Orbit Baby',
  'pegperego.com': 'Peg Perego',
  'radioflyer.com': 'Radio Flyer',
  'safety1st.com': 'Safety 1st',
  'silvercrossus.com': 'Silver Cross',
  'thule.com': 'Thule',
  'uppababy.com': 'UPPAbaby',
  'wonderfoldwagon.com': 'WonderFold',
};

function parseHttpUrl(value: string | null | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

/**
 * The retailer page behind a network wrapper (ShopMy, Awin, Impact), or the URL
 * itself. Only reads the wrapper's destination parameter; never builds one.
 */
export function storeDestinationUrl(value: string | null | undefined): URL | null {
  const url = parseHttpUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  const param =
    host === 'go.shopmy.us' ? 'url'
      : host.endsWith('awin1.com') ? 'ued'
        : host.endsWith('.pxf.io') || host.endsWith('.sjv.io') ? 'u'
          : null;
  if (!param) return url;
  return parseHttpUrl(url.searchParams.get(param)) ?? url;
}

function hostMatches(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

/** Button name for a store link: known store → its name, else the bare hostname. */
export function storeRetailerName(value: string | null | undefined): string | null {
  const url = storeDestinationUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  for (const [domain, name] of Object.entries(STORE_HOSTS)) {
    if (hostMatches(host, domain)) return name;
  }
  return host || null;
}

/** True when the link (or the page it wraps) is on one of the given domains. */
export function isStoreUrlOn(value: string | null | undefined, domains: string[]): boolean {
  const url = storeDestinationUrl(value);
  if (!url) return false;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  return domains.some((domain) => hostMatches(host, domain));
}
