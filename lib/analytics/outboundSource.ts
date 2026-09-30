const TOOL_PATHS: Record<string, string> = {
  '/tools/stroller-finder': 'stroller-finder',
  '/tools/travel-system': 'travel-system-checker',
  '/tools/stroller-quiz': 'stroller-quiz',
  '/tools/compare': 'stroller-compare',
  '/resources/baby-checklist': 'baby-checklist',
};
export function outboundSource(source: string | null | undefined, path: string | null | undefined) {
  if (source && source !== 'link') return source;
  const pathname = (path ?? '').split('?')[0].replace(/\/+$/, '');
  for (const [prefix, tool] of Object.entries(TOOL_PATHS)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return `tool:${tool}`;
  }
  if (pathname.startsWith('/blog/')) return 'blog';
  if (/^\/(guides|academy|learn)(\/|$)/.test(pathname)) return 'guide';
  return source ?? 'link';
}
