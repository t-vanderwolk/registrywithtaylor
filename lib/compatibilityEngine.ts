export type CompatibilityType = 'DIRECT' | 'ADAPTER' | 'LIMITED' | 'LOCKED' | 'INCOMPATIBLE';
export type CompatibilityConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type TravelSystemStrollerOption = {
  brand: string;
  model: string;
  displayName: string;
  summary: string | null;
};

export type TravelSystemCarSeatOption = {
  brand: string;
  model: string;
  displayName: string;
  summary: string | null;
};

export type CompatibleCarSeatResult = {
  brand: string;
  model: string;
  displayName: string;
  compatibilityType: CompatibilityType;
  adapterRequired: boolean;
  adapterType: string | null;
  notes: string | null;
  confidence: CompatibilityConfidence;
  imageUrl?: string | null;
  imageAlt?: string | null;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  babylistImage?: string | null;
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
  notes: string | null;
  confidence: CompatibilityConfidence;
  imageUrl?: string | null;
  imageAlt?: string | null;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  babylistImage?: string | null;
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
