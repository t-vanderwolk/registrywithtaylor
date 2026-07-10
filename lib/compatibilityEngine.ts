export type CompatibilityType = 'DIRECT' | 'ADAPTER' | 'LIMITED' | 'LOCKED' | 'INCOMPATIBLE';
export type CompatibilityConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type TravelSystemStrollerOption = {
  brand: string;
  model: string;
  displayName: string;
  summary: string | null;
  babylistImage?: string | null;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  macroBabyImage?: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  bombiUrl?: string | null;
  bombiPrice?: number | null;
  bombiImage?: string | null;
  amazonUrl?: string | null;
};

export type TravelSystemCarSeatOption = {
  brand: string;
  model: string;
  displayName: string;
  summary: string | null;
  babylistImage?: string | null;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  macroBabyImage?: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  bombiUrl?: string | null;
  bombiPrice?: number | null;
  bombiImage?: string | null;
  amazonUrl?: string | null;
  /** Sold only as a travel system with a stroller — no standalone buy link. */
  travelSystemOnly?: boolean;
};

/**
 * Infant seats sold ONLY bundled as a travel system with a stroller (no
 * standalone purchase). They still appear in the checker and carry full adapter
 * compatibility, but show a "travel system only" note in place of a buy link.
 * Keyed brand:::model, lowercased.
 */
const TRAVEL_SYSTEM_ONLY_SEATS = new Set<string>(['nuna:::pipa urbn']);

export function isTravelSystemOnlySeat(
  brand: string | null | undefined,
  model: string | null | undefined,
): boolean {
  return TRAVEL_SYSTEM_ONLY_SEATS.has(`${(brand ?? '').trim().toLowerCase()}:::${(model ?? '').trim().toLowerCase()}`);
}

export type CompatibleCarSeatResult = {
  brand: string;
  model: string;
  displayName: string;
  compatibilityType: CompatibilityType;
  adapterRequired: boolean;
  adapterType: string | null;
  adapterImage?: string | null;
  adapterUrl?: string | null;
  adapterPrice?: number | null;
  notes: string | null;
  confidence: CompatibilityConfidence;
  imageUrl?: string | null;
  imageAlt?: string | null;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  babylistImage?: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  macroBabyImage?: string | null;
  bombiUrl?: string | null;
  bombiPrice?: number | null;
  bombiImage?: string | null;
  amazonUrl?: string | null;
  /** Sold only as a travel system with a stroller — no standalone buy link. */
  travelSystemOnly?: boolean;
};

export type TravelSystemCompatibilityResponse = {
  stroller: TravelSystemStrollerOption;
  compatibleCarSeats: CompatibleCarSeatResult[];
};

export type CompatibleStrollerResult = {
  brand: string;
  model: string;
  displayName: string;
  summary: string | null;
  compatibilityType: CompatibilityType;
  adapterRequired: boolean;
  adapterType: string | null;
  adapterImage?: string | null;
  adapterUrl?: string | null;
  adapterPrice?: number | null;
  notes: string | null;
  confidence: CompatibilityConfidence;
  imageUrl?: string | null;
  imageAlt?: string | null;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  babylistImage?: string | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  macroBabyImage?: string | null;
  bombiUrl?: string | null;
  bombiPrice?: number | null;
  bombiImage?: string | null;
  amazonUrl?: string | null;
};

export type TravelSystemCompatibilityByCarSeatResponse = {
  carSeat: TravelSystemCarSeatOption;
  compatibleStrollers: CompatibleStrollerResult[];
};

const COMPATIBILITY_SCORES: Record<CompatibilityType, number> = {
  DIRECT: 500,
  ADAPTER: 400,
  LIMITED: 300,
  LOCKED: 200,
  INCOMPATIBLE: 100,
};

const CONFIDENCE_SCORES: Record<CompatibilityConfidence, number> = {
  HIGH: 30,
  MEDIUM: 20,
  LOW: 10,
};

export function normalizeCompatibilityType(value: string): CompatibilityType {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case 'DIRECT':
    case 'ADAPTER':
    case 'LIMITED':
    case 'LOCKED':
    case 'INCOMPATIBLE':
      return normalized;
    default:
      return 'INCOMPATIBLE';
  }
}

export function normalizeCompatibilityConfidence(value: string): CompatibilityConfidence {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case 'HIGH':
    case 'MEDIUM':
    case 'LOW':
      return normalized;
    default:
      return 'MEDIUM';
  }
}

export function formatCompatibilityType(type: CompatibilityType) {
  switch (type) {
    case 'DIRECT':
      return 'Direct';
    case 'ADAPTER':
      return 'Adapter';
    case 'LIMITED':
      return 'Limited';
    case 'LOCKED':
      return 'Locked';
    case 'INCOMPATIBLE':
    default:
      return 'Incompatible';
  }
}

export function formatCompatibilityConfidence(confidence: CompatibilityConfidence) {
  switch (confidence) {
    case 'HIGH':
      return 'High';
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
    default:
      return 'Medium';
  }
}

export function getCompatibilityScore(item: { compatibilityType: string }) {
  return COMPATIBILITY_SCORES[normalizeCompatibilityType(item.compatibilityType)];
}

export function compareCompatibleCarSeats(left: CompatibleCarSeatResult, right: CompatibleCarSeatResult) {
  const compatibilityDelta = getCompatibilityScore(right) - getCompatibilityScore(left);
  if (compatibilityDelta !== 0) {
    return compatibilityDelta;
  }

  const confidenceDelta =
    CONFIDENCE_SCORES[right.confidence] - CONFIDENCE_SCORES[left.confidence];
  if (confidenceDelta !== 0) {
    return confidenceDelta;
  }

  return (
    left.brand.localeCompare(right.brand) ||
    left.model.localeCompare(right.model) ||
    left.displayName.localeCompare(right.displayName)
  );
}

export function compareCompatibleStrollers(left: CompatibleStrollerResult, right: CompatibleStrollerResult) {
  const compatibilityDelta = getCompatibilityScore(right) - getCompatibilityScore(left);
  if (compatibilityDelta !== 0) {
    return compatibilityDelta;
  }

  const confidenceDelta =
    CONFIDENCE_SCORES[right.confidence] - CONFIDENCE_SCORES[left.confidence];
  if (confidenceDelta !== 0) {
    return confidenceDelta;
  }

  return (
    left.brand.localeCompare(right.brand) ||
    left.model.localeCompare(right.model) ||
    left.displayName.localeCompare(right.displayName)
  );
}
