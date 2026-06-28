const COLOR_OR_FABRIC_WORDS = new Set([
  'acorn',
  'almond',
  'anthracite',
  'ash',
  'beige',
  'biscotti',
  'black',
  'blue',
  'blush',
  'brown',
  'camel',
  'caviar',
  'cedar',
  'charcoal',
  'chocolate',
  'clay',
  'cognac',
  'cream',
  'dark',
  'denim',
  'desert',
  'dillan',
  'dusty',
  'eclipse',
  'emmett',
  'forest',
  'frost',
  'granite',
  'graphite',
  'gray',
  'grey',
  'greyson',
  'green',
  'hazelwood',
  'heather',
  'indigo',
  'ivory',
  'jade',
  'jake',
  'lagoon',
  'latte',
  'lunar',
  'mica',
  'midnight',
  'mocha',
  'mushroom',
  'navy',
  'noa',
  'onyx',
  'opal',
  'pearl',
  'peppercorn',
  'pink',
  'pine',
  'red',
  'riveted',
  'rose',
  'sand',
  'savannah',
  'shadow',
  'slate',
  'stone',
  'taupe',
  'teak',
  'thistle',
  'timber',
  'truffle',
  'white',
]);

const VARIANT_NOISE_RE =
  /\b(?:with|w)\s+magnetic\s+buckle\b|\bbmw\s*x\b|\bbmw\b|\bspecial\s+edition\b|\b(?:strollers?|baby|child|everyday|travel|modular|compact|full size|jogging|all terrain|single child|self folding|auto folding)\b|\b(?:side by side|single to double|2 seater|4 seater)\b|\b(?:cleartex|clearlux|tencel|recycled|leatherette|leather|mesh|fabric)\b|\b(?:base|chassis|pram|bassinet|adapter|seat pack|second seat|snack tray|cup holder|organizer|bag)\b/gi;

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripBrandPrefix(model: string, brand: string) {
  const brandTokens = normalizeText(brand).split(' ').filter(Boolean);
  const modelTokens = normalizeText(model).split(' ').filter(Boolean);

  while (
    brandTokens.length > 0 &&
    modelTokens.slice(0, brandTokens.length).join(' ') === brandTokens.join(' ')
  ) {
    modelTokens.splice(0, brandTokens.length);
  }

  return modelTokens.join(' ');
}

export function normalizeStrollerVariantModel(model: string, brand: string) {
  let value = stripBrandPrefix(model, brand);
  value = value.replace(/\bin\s+[a-z0-9][a-z0-9\s/.-]+$/i, ' ');
  value = value.replace(
    /\b(?:black|caviar|biscotti|granite|acorn|thistle|mica|cognac|chocolate)\s*\/\s*(?:black|caviar|biscotti|granite|acorn|thistle|mica|cognac|chocolate)\b/gi,
    ' ',
  );
  value = value.replace(/\bdubl\b/gi, 'double');
  value = value.replace(VARIANT_NOISE_RE, ' ');

  return normalizeText(value)
    .split(' ')
    .filter((token) => token && !COLOR_OR_FABRIC_WORDS.has(token))
    .join(' ');
}

export function strollerVariantNoiseScore(model: string, brand: string) {
  const stripped = stripBrandPrefix(model, brand);
  const normalized = normalizeStrollerVariantModel(model, brand);
  let score = 0;

  if (normalized !== normalizeText(stripped)) score += 2;
  if (/\bin\s+[a-z0-9][a-z0-9\s/.-]+$/i.test(model)) score += 2;
  if (/\b(?:with|w)\s+magnetic\s+buckle\b/i.test(model)) score += 2;
  if (/\bbmw\b|\bspecial\s+edition\b/i.test(model)) score += 2;
  if (/\b(?:size|base|chassis|pram|bassinet|adapter|second seat|seat pack)\b/i.test(model)) score += 3;
  if (normalizeText(model).split(' ').some((token) => COLOR_OR_FABRIC_WORDS.has(token))) score += 1;

  return score;
}
