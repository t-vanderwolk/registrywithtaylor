import { sanitizeGuideAffiliateModules, sanitizeGuideFaqItems, sanitizeStringList } from '@/lib/guides/types';

export const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const asNullableText = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

export const hasOwn = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

export const asStringArray = sanitizeStringList;

export const isValidImageUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith('/');

export const isValidLinkTarget = (value: string) =>
  /^https?:\/\//i.test(value) || value.startsWith('/') || value.startsWith('#');

export const asNullableImageUrl = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 && isValidImageUrl(text) ? text : null;
};

export const asNullableLinkTarget = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 && isValidLinkTarget(text) ? text : null;
};

export const asGuideFaqItems = sanitizeGuideFaqItems;
export const asGuideAffiliateModules = sanitizeGuideAffiliateModules;

