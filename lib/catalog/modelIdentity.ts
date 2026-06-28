export function normalizeModelIdentityPart(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKC')
    .replace(/[™®©]/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, '');
}

export function productModelKey(brand: string, model: string) {
  return `${normalizeModelIdentityPart(brand)}|${normalizeModelIdentityPart(model)}`;
}
